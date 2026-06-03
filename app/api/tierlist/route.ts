import { NextResponse } from "next/server";
import { mongoClientPromise, mongoDbName } from "@/lib/mongodb";
import { findTierListNameIssue } from "@/lib/tier-list-validation";

type TierListDocument = {
  assignments: Record<string, string>;
  authorName?: string;
  authorUid?: string;
  createdAt: number;
  id: string;
  likes: string[];
  name: string;
  tiers: string[];
};

const getCollection = async () => {
  const client = await mongoClientPromise;

  return client.db(mongoDbName).collection<TierListDocument>("tierlist");
};

const normalizeTierList = (value: any): TierListDocument | null => {
  if (!value || typeof value !== "object") return null;

  const name = typeof value.name === "string" ? value.name.trim() : "";
  const id = typeof value.id === "string" && value.id ? value.id : `${Date.now()}`;
  const assignments =
    value.assignments && typeof value.assignments === "object" && !Array.isArray(value.assignments)
      ? Object.fromEntries(
          Object.entries(value.assignments).filter(
            ([operatorName, tier]) => typeof operatorName === "string" && typeof tier === "string",
          ),
        )
      : {};
  const tiers = Array.isArray(value.tiers)
    ? value.tiers.filter((tier: unknown): tier is string => typeof tier === "string")
    : [];
  const likes = Array.isArray(value.likes)
    ? [...new Set(value.likes.filter((uid: unknown): uid is string => typeof uid === "string"))]
    : [];

  if (!name || findTierListNameIssue(name) || tiers.length === 0) return null;

  return {
    assignments,
    authorName: typeof value.authorName === "string" ? value.authorName : "",
    authorUid: typeof value.authorUid === "string" ? value.authorUid : "",
    createdAt: typeof value.createdAt === "number" ? value.createdAt : Date.now(),
    id,
    likes,
    name,
    tiers,
  };
};

export async function GET() {
  const collection = await getCollection();
  await collection.updateMany({ liked: { $exists: true } } as any, { $unset: { liked: "" } });
  await collection.updateMany(
    {
      $or: [
        { likes: { $exists: false } },
        { likes: { $type: "number" } },
        { likes: null },
      ],
    } as any,
    { $set: { likes: [] } },
  );

  const tierLists = (await collection
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .toArray())
    .map((tierList) => normalizeTierList(tierList))
    .filter((tierList): tierList is TierListDocument => tierList !== null);

  return NextResponse.json({ tierLists });
}

export async function DELETE(request: Request) {
  const payload = await request.json();
  const id = typeof payload.id === "string" ? payload.id : "";

  if (!id) {
    return NextResponse.json({ message: "Missing tier list id" }, { status: 400 });
  }

  const collection = await getCollection();
  await collection.deleteOne({ id });

  return NextResponse.json({ id });
}

export async function POST(request: Request) {
  const payload = await request.json();
  const tierList = normalizeTierList(payload);

  if (!tierList) {
    return NextResponse.json({ message: "Invalid tier list payload" }, { status: 400 });
  }

  const collection = await getCollection();
  await collection.updateOne(
    { id: tierList.id },
    {
      $set: {
        ...tierList,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        insertedAt: new Date(),
      },
    },
    { upsert: true },
  );

  return NextResponse.json({ tierList });
}

export async function PATCH(request: Request) {
  const payload = await request.json();
  const id = typeof payload.id === "string" ? payload.id : "";
  const uid = typeof payload.uid === "string" ? payload.uid.trim() : "";

  if (!id || !uid) {
    return NextResponse.json({ message: "Missing tier list id or uid" }, { status: 400 });
  }

  const collection = await getCollection();
  const existing = await collection.findOne({ id }, { projection: { _id: 0, likes: 1 } });

  if (!existing) {
    return NextResponse.json({ message: "Tier list not found" }, { status: 404 });
  }

  const existingLikes = Array.isArray(existing.likes) ? existing.likes : [];
  const nextLikes = existingLikes.includes(uid) ? existingLikes : [...existingLikes, uid];

  await collection.updateOne({ id }, { $set: { likes: nextLikes, updatedAt: new Date() } });

  return NextResponse.json({ id, likes: nextLikes });
}
