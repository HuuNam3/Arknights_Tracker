# Arknights Tracker

Arknights Tracker là một web app tổng hợp công cụ dành cho người chơi Arknights. Dự án gom những nhu cầu tra cứu phổ biến như banner, operator, pull planner, recruitment, sanity, news và gacha history vào cùng một nơi để dùng nhanh hơn.

## Overview

Website này được xây để phục vụ 2 mục tiêu chính:

- Giúp người chơi tra cứu thông tin Arknights nhanh, gọn và dễ dùng.
- Biến dữ liệu rời rạc từ nhiều nguồn thành một giao diện thống nhất hơn.

## Features

- `Doctor Lookup`
  Tra cứu thông tin Doctor bằng UID.
- `Pull Planner`
  Tính số pull hiện có, tài nguyên tích lũy và khả năng chuẩn bị cho banner mục tiêu.
- `Recruitment Calculator`
  Chọn tag để xem các tổ hợp hợp lệ và operator có thể xuất hiện.
- `Sanity Tracker`
  Theo dõi sanity hiện tại và thời điểm hồi đầy.
- `Banner Tracker`
  Xem banner đã ra, banner hiện tại, banner sắp tới và trạng thái limited.
- `Characters`
  Tra cứu operator theo độ hiếm, ngày phát hành và trạng thái phát hành Global.
- `News`
  Theo dõi tin tức Arknights Global.
- `Tier List`
  Tự sắp xếp operator theo đánh giá cá nhân và lưu lại trên trình duyệt.
- `Gacha History`
  Xem lịch sử quay khi người dùng cung cấp `token` hoặc cookie hợp lệ.

## Data Sources

Dự án không nhập tay toàn bộ dữ liệu. Ứng dụng lấy và xử lý dữ liệu từ các nguồn sau:

- `arknights.wiki.gg`
  Dùng cho danh sách operator và banner.
- `arknights.global`
  Dùng cho tra cứu Doctor theo UID.
- `account.yo-star.com`
  Dùng cho news archive và gacha history.

Nói ngắn gọn: đây là một lớp giao diện và xử lý dữ liệu đặt trên các nguồn Arknights sẵn có.

## User Experience

Ứng dụng được tổ chức theo hướng mở ra là dùng được ngay:

- Trang chủ dẫn nhanh đến các công cụ chính.
- Điều hướng bên trái giúp chuyển trang nhanh.
- Một số dữ liệu người dùng được lưu trên trình duyệt để không phải nhập lại mỗi lần.
- Các công cụ quan trọng như pull planner, sanity và tier list được tối ưu cho việc dùng lặp lại.

## What Is Stored Locally

Để tiện cho người dùng quay lại sau, ứng dụng hiện lưu một số dữ liệu ngay trên trình duyệt:

- UID đã tra cứu gần nhất
- hồ sơ Doctor gần nhất
- token/cookie dùng cho gacha history
- dữ liệu pull planner
- tier list draft và các tier list đã lưu
- trạng thái sanity theo từng UID

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI components

### App Infrastructure

- Next.js App Router
- Next.js API Routes
- Vercel Analytics trong production

## Installation

1. Clone repository:

```bash
git clone <repository-url>
cd ArkReview
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

Ứng dụng sẽ chạy tại [http://localhost:3000](http://localhost:3000).

## Environment Variables

Dự án hiện dùng một biến môi trường tùy chọn:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

Biến này được dùng cho canonical URL, sitemap, robots và metadata. Nếu không cấu hình, app sẽ dùng giá trị mặc định `https://arknights-tool.vercel.app`.

## Available Scripts

- `npm run dev`
  Chạy môi trường development.
- `npm run build`
  Build production.
- `npm run start`
  Chạy bản production sau khi build.
- `npm run lint`
  Kiểm tra mã nguồn bằng ESLint.

## Project Structure

```text
app/
├── api/                         # API routes xử lý dữ liệu operator, banner, gacha
├── banners/                     # Trang banner tracker
├── characters/                  # Trang operator releases
├── gacha/                       # Trang gacha history
├── news/                        # Trang tin tức
├── tier-list/                   # Trang tier list
├── tools/                       # Pull planner, recruitment, sanity
├── layout.tsx                   # Layout chính
├── page.tsx                     # Trang chủ
├── robots.ts                    # Robots metadata
└── sitemap.ts                   # Sitemap metadata

components/
├── game-user-page.tsx           # Component lõi của phần lớn tính năng
├── home-landing.tsx             # Landing page
├── site-header.tsx              # Điều hướng chính
└── ui/                          # Reusable UI components

lib/
└── site-navigation.ts           # Cấu hình điều hướng
```

## Technical Notes

- Một số API nội bộ được dùng để gom, chuẩn hóa và trả dữ liệu về giao diện.
- Dữ liệu từ nguồn ngoài có cache theo thời gian để giảm số lần gọi lại.
- Tính năng gacha history phụ thuộc vào token/cookie hợp lệ do người dùng tự cung cấp.
- `next.config.mjs` hiện đang bật `typescript.ignoreBuildErrors = true`, nên vẫn cần kiểm tra kỹ trước khi deploy bản lớn.

## Purpose

Đây là một dự án tập trung vào tính hữu dụng. Mục tiêu không phải là làm một wiki đầy đủ, mà là tạo ra một bộ công cụ thực tế, nhanh và thuận tiện cho người chơi Arknights hằng ngày.
