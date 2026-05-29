import { GameUserPage } from '@/components/game-user-page'

export const metadata = {
  title: 'Arknights Tracker',
  description:
    'Track Arknights gacha history, banner schedules, operator releases, and tier lists.',
}

export default function Page() {
  return <GameUserPage />
}
