# Brief giao Claude Code: dựng website B2B giới thiệu doanh nghiệp

Oct 26, 2026 · @PT

Tài liệu này giao cho Claude Code dựng từ đầu một website giới thiệu doanh nghiệp B2B (corporate site) trong một lượt, không cần hỏi lại, miễn là mục Tham số dự án đã được điền hoặc chấp nhận giá trị mặc định.

## Tham số dự án

Điền bảng này trước khi giao cho Claude Code; ô nào để nguyên thì dùng giá trị mặc định, và mọi giả định được ghi vào mục Assumptions của README.

| Tham số | Giá trị mặc định | Ghi chú |
| --- | --- | --- |
| Tên thương hiệu | `NetworkAI` | Chỉ khai báo một lần trong `site.config.ts`, mọi nơi khác đọc từ đó |
| Định vị (1 câu) | Giải pháp công nghệ cho doanh nghiệp B2B | Làm gì, cho ai |
| Ngôn ngữ | Tiếng Anh (mặc định) và tiếng Việt | Route `/en` và `/vi` |
| Màu chủ đạo | `#0f5bff` | Lấy nguyên từ giao diện cũ, xem bảng Tông màu giữ lại ở mục Tài sản; không có màu nhấn thứ hai. Đặt làm design token, đổi một chỗ là đổi toàn site |
| Domain | `example.com` | Dùng cho canonical, `sitemap.xml`, Open Graph |
| Email nhận lead | `sales@networkai.vn` | Biến môi trường `CONTACT_TO_EMAIL` |
| Thông tin liên hệ | Địa chỉ và điện thoại giả lập; email dùng email của sếp | Đặt trong `site.config.ts` |
| Nơi triển khai | Vercel | Chỉ chuẩn bị cấu hình, không tự deploy |

## Tài sản giữ lại từ dự án cũ

Dự án NetworkAI cũ chỉ được giữ lại ba thứ: ảnh, email liên hệ của sếp và tông màu. Mọi thứ còn lại (code, schema Prisma, dữ liệu, chữ nội dung, backup, tài khoản, cấu hình) bỏ hết và không đọc lại để tham khảo (tông màu đã chép sẵn bên dưới nên không cần mở file CSS cũ); website mới dựng từ đầu theo brief này.

**Nguồn:** repo `letatkhoa3000/networkai-full`, commit `a71ae97`. Clone nông vào một thư mục tạm nằm ngoài dự án mới, chỉ lấy ảnh trong `public/` của repo đó.

**Ảnh mang sang**

| Nguồn trong repo cũ | Số file | Đích trong dự án mới | Ghi chú |
| --- | --- | --- | --- |
| `public/brand/` và `public/brand-logo.png` | 6 | `public/images/brand/` | Logo NetworkAI các biến thể (đầy đủ, biểu tượng, wordmark); dùng cho header, footer, favicon |
| `public/uploads/projects/` | 61, trong đó 55 file khác nhau | `public/images/projects/` | Ảnh dự án và ảnh chụp màn hình, rộng 1600 px; bỏ bản trùng nội dung |
| `public/uploads/site-content/` | 3 | `public/images/home/` | Ảnh cho Hero và các khối trang chủ |
| `public/uploads/services/` | 2 | `public/images/solutions/` | Ảnh và biểu tượng giải pháp |
| `public/vendor-logos/` và `public/uploads/logos/` | 14 và 9, trùng 1 file | `public/images/partners/` | Logo đối tác; gộp hai thư mục, bỏ bản trùng |

**Cách xử lý ảnh**

- Bỏ các file mẫu của Next.js: `next.svg`, `window.svg`, `globe.svg`, `vercel.svg`, `file.svg`.
- Mở xem từng ảnh trước khi dùng, rồi gắn vào bản ghi mẫu hợp nội dung (ảnh khách sạn cho Project, ảnh hạ tầng và thiết bị cho Solution). Viết `alt` mới bằng tiếng Anh và tiếng Việt.
- Đổi tên file theo kebab-case mô tả nội dung, không giữ chuỗi UUID của dự án cũ.
- Chuyển ảnh chụp sang WebP, mỗi file dưới 300 KB; giữ nguyên SVG.
- Ảnh nào không dùng đến thì liệt kê trong README, mục Assets.
- Logo đối tác và khách sạn là nhãn hiệu của bên thứ ba: ghi trong README rằng cần công ty xác nhận quyền dùng trước khi chạy thật.

**Email liên hệ của sếp:** `sales@networkai.vn`. Dùng làm email hiển thị ở Footer và trang Contact, đồng thời là email nhận lead mặc định (`CONTACT_TO_EMAIL` trong `.env.example`). Không mang sang các email khác của dự án cũ, nhất là email đăng nhập admin.

**Tông màu giữ lại**

Giao diện công khai của dự án cũ dùng nền xanh nhạt, chữ xanh đen và một màu xanh dương duy nhất làm màu chủ đạo, không có màu nhấn thứ hai. Giữ nguyên các giá trị dưới đây làm design token, không thêm màu mới.

| Token | Giá trị | Dùng cho |
| --- | --- | --- |
| `--brand-500` | `#0f5bff` | Màu chủ đạo: nút chính, link, nhãn mục, viền focus, dải CTA |
| `--brand-600` | `#0848d6` | Nút chính khi di chuột |
| `--brand-soft` | `#eaf1ff` | Nền nhạt cho vùng nhấn mạnh |
| `--bg-page` | `#f3f8fd` | Nền trang |
| `--bg-page-alt` | `#edf5fc` | Nền xen kẽ giữa các khối |
| `--bg-card` | `#ffffff` | Nền thẻ và panel |
| `--bg-soft` | `#f8fbff` | Nền chip và ô phụ |
| `--bg-soft-strong` | `#eef4ff` | Nền phụ đậm hơn một nấc |
| `--border-soft` | `#d9e4ef` | Viền thẻ, đường kẻ |
| `--border-strong` | `#c7d6e6` | Viền nút phụ và ô nhập; khi di chuột `#aebfd4` |
| `--text-strong` | `#0f1d33` | Tiêu đề |
| `--text-body` | `#2f435d` | Đoạn văn |
| `--text-muted` | `#61748e` | Chữ phụ, chú thích trên nền trắng (4.8:1) |
| Nền đầu trang con | `#eef5fb` đến `#ffffff`, từ trên xuống | Dải chuyển màu ở đầu các trang con |
| Lỗi | nền `#fef2f2`, viền `#fecaca`, chữ `#b91c1c` | Thông báo lỗi của form |
| Thành công | nền `#ecfdf5`, viền `#a7f3d0`, chữ `#047857` | Thông báo gửi thành công |

- Bóng và vùng chọn: bóng xanh nhạt `rgba(15, 91, 255, 0.2)` cho panel, bóng xám xanh `rgba(15, 23, 42, 0.12)` cho thẻ, vùng chọn chữ `rgba(15, 91, 255, 0.24)` với chữ trắng.
- Khai báo thành CSS variables trong `app/globals.css`, rồi ánh xạ sang cấu hình Tailwind của phiên bản đã cài (khối `@theme` nếu là Tailwind 4) để dùng được class như `bg-brand-500`.
- Không mang sang bảng `navy` và thang `brand` trong `tailwind.config.js` cũ: chỉ khu admin dùng, và khu admin đã bỏ.
- Độ tương phản đã đo: chữ trắng trên `#0f5bff` đạt 5.3:1. `--text-muted` đặt trên nền xanh nhạt chỉ đạt 4.3 đến 4.5:1, nên chữ phụ nằm trên nền xanh nhạt dùng `#5a6d88` (từ 4.8:1) và ghi vào Assumptions.

## Mục tiêu và phạm vi

Kết quả cần có là một website marketing nhiều trang, chạy được bằng `npm run dev`, build sạch bằng `npm run build` và sẵn sàng đẩy lên Vercel.

**Mục tiêu**

- Tạo uy tín cho doanh nghiệp và giải thích rõ các giải pháp.
- Thu lead qua form ở trang Contact, kèm nút kêu gọi hành động (CTA) ở các trang khác.
- Cập nhật nội dung bằng cách sửa file trong `/content`, không phải sửa component.

**Ngoài phạm vi, không làm**

- Đăng nhập, thanh toán, dashboard, giỏ hàng.
- Backend riêng hoặc database; lead chỉ gửi qua email.
- Tự deploy, tự mua domain, tự tạo tài khoản dịch vụ bên ngoài.

## Stack và quy ước kỹ thuật

Dùng đúng stack dưới đây; chỉ đổi khi một mục bị chặn thật sự và phải ghi lý do vào README.

| Hạng mục | Chọn | Ghi chú |
| --- | --- | --- |
| Framework | Next.js (App Router), TypeScript strict | Sinh tĩnh (static generation) cho mọi trang nội dung |
| Giao diện | Tailwind CSS, design token qua CSS variables | Component dùng lại: `Button`, `Card`, `Section`, `Container`, `Hero` |
| Nội dung | File trong `/content` qua một lớp truy cập `lib/content.ts` | MDX có frontmatter cho mọi bản ghi (Solution, Project, Segment, News, Job), JSON cho Partner. Lớp này là nơi duy nhất đọc nội dung, để sau thay bằng headless CMS mà không sửa trang |
| Đa ngôn ngữ | `next-intl`, route `/en` và `/vi` | Chuỗi giao diện ở `messages/*.json`, nội dung dài có bản riêng theo ngôn ngữ |
| Form liên hệ | React Hook Form + Zod, gửi tới API route | Gửi email qua Resend với `RESEND_API_KEY`; thiếu key thì ghi log phía server và báo thành công ở môi trường dev |
| Chống spam | Trường honeypot + giới hạn tốc độ đơn giản theo IP | Không dùng CAPTCHA bên thứ ba ở bản đầu |
| Ảnh và font | `next/image`, `next/font` | Một font sans-serif hỗ trợ tiếng Việt (Inter hoặc Be Vietnam Pro) |
| Kiểm tra | ESLint, `tsc --noEmit`, Playwright smoke test | Gộp trong `npm run check` |
| Triển khai | Cấu hình sẵn cho Vercel | Liệt kê biến môi trường trong `.env.example` |

**Quy ước**

- Thư mục cấp một (chi tiết ở mục Cấu trúc thư mục và cách cập nhật): `app/[locale]/`, `components/`, `content/`, `lib/`, `messages/`, `public/`.
- Không hard-code chuỗi hiển thị trong component; mọi chuỗi đi qua `messages/*.json` hoặc `/content`.
- Không thêm thư viện UI nặng; thư viện nào thêm phải có lý do ghi trong README.

## Route và mô hình nội dung

Site có 17 route, tất cả nằm dưới tiền tố `/[locale]`, và 6 loại nội dung lặp lại.

| Route | Nội dung | Ghi chú |
| --- | --- | --- |
| `/` | Trang chủ | Xem mục Trang chủ và thiết kế |
| `/about` | About us | Giới thiệu, giá trị, vài con số, đội ngũ (dữ liệu mẫu) |
| `/partners` | Partners | Lưới logo đối tác (dữ liệu mẫu) |
| `/news`, `/news/[slug]` | Danh sách và chi tiết tin | MDX, mới nhất trước |
| `/jobs`, `/jobs/[slug]` | Danh sách và chi tiết việc làm | Nút ứng tuyển mở email |
| `/segments`, `/segments/[slug]` | Lĩnh vực | 2 lĩnh vực mẫu, liệt kê giải pháp liên quan |
| `/solutions`, `/solutions/[slug]` | Danh sách và chi tiết giải pháp | 6 giải pháp mẫu |
| `/projects`, `/projects/[slug]` | Danh sách và chi tiết dự án | 3 dự án mẫu |
| `/contact` | Form liên hệ | Trường: họ tên, công ty, email, điện thoại, nội dung, đồng ý chính sách |
| `/privacy-policy`, `/cookies` | Trang pháp lý | Nội dung mẫu, ghi rõ cần pháp chế thẩm định |
| `/sitemap` | Sơ đồ trang dạng HTML | Kèm `sitemap.xml` sinh tự động |

Mỗi bản ghi nội dung có bản `en` và `vi`; thiếu bản `vi` thì dùng bản `en`. Mọi loại nội dung được khai báo bằng Zod schema trong `lib/content.ts`.

| Loại | Trường bắt buộc | Trường tuỳ chọn |
| --- | --- | --- |
| Solution | `slug`, `title`, `tagline`, `summary`, `body`, `image` | `features[]`, `relatedProjects[]`, `order` |
| Project | `slug`, `title`, `client`, `location`, `year`, `summary`, `body`, `coverImage` | `solutions[]`, `segment`, `gallery[]`, `featured` |
| Segment | `slug`, `title`, `summary`, `body`, `image` | `solutions[]` |
| News | `slug`, `title`, `date`, `excerpt`, `body` | `coverImage`, `tags[]` |
| Job | `slug`, `title`, `location`, `type`, `description` | `postedAt`, `applyEmail` |
| Partner | `name`, `logo`, `url` | `description` |

## Cấu trúc thư mục và cách cập nhật

Nội dung, giao diện và cấu hình nằm ở ba chỗ tách biệt, nên đa số lần cập nhật chỉ là thêm hoặc sửa một file nội dung hay file dịch, không phải động vào code.

```text
.
├─ app/
│  ├─ [locale]/                    # chỉ chứa route, mỏng, không có logic nghiệp vụ
│  │  ├─ layout.tsx
│  │  ├─ page.tsx                  # trang chủ
│  │  ├─ about/  partners/  contact/  privacy-policy/  cookies/  sitemap/
│  │  └─ solutions/  projects/  segments/  news/  jobs/   # mỗi nhóm: page.tsx + [slug]/page.tsx
│  ├─ api/contact/route.ts         # nhận form, gửi email
│  ├─ globals.css                  # design token: màu, font, khoảng cách
│  └─ sitemap.ts  robots.ts
├─ components/
│  ├─ ui/                          # Button, Card, Container, Chip
│  ├─ sections/                    # Hero, SolutionGrid, FeaturedProjects, CtaBand
│  └─ layout/                      # Header, Footer, LanguageSwitcher, CookieBanner
├─ content/                        # NỘI DUNG: nơi sửa chính khi cập nhật
│  ├─ solutions/<slug>/en.mdx, vi.mdx
│  ├─ projects/<slug>/en.mdx, vi.mdx
│  ├─ segments/<slug>/en.mdx, vi.mdx
│  ├─ news/<slug>/en.mdx, vi.mdx
│  ├─ jobs/<slug>/en.mdx, vi.mdx
│  └─ partners.json
├─ lib/
│  ├─ content.ts                   # schema Zod + hàm đọc; nơi duy nhất đọc /content
│  └─ email/  seo/  i18n/
├─ messages/                       # en.json, vi.json: chữ giao diện (nút, nhãn, lỗi form)
├─ public/
│  ├─ images/<loại>/<slug>/        # ảnh theo từng bản ghi
│  └─ placeholders/                # ảnh mẫu tự tạo
├─ tests/e2e/                      # Playwright
├─ .github/workflows/ci.yml        # chạy npm run check trên mỗi pull request
├─ site.config.ts                  # tên, menu, liên hệ, mạng xã hội, danh sách locale
├─ .env.example
└─ README.md
```

**Quy tắc để cấu trúc không rối theo thời gian**

- Mỗi bản ghi nội dung là một thư mục theo `slug`, chứa bản `en` và `vi` cạnh nhau. Phần thân là MDX, các trường còn lại nằm trong frontmatter và được Zod kiểm tra khi build.
- Phụ thuộc đi một chiều: `components/ui` rồi `components/sections` rồi `app/[locale]`. Route không chứa logic, `ui` không biết gì về nội dung.
- Menu, tên thương hiệu và thông tin liên hệ chỉ khai báo trong `site.config.ts`, không lặp lại ở component.
- Chỉ tách một component vào `components/ui` khi nó dùng ở từ hai section trở lên; không tạo thư mục mới cho một file.

**Khi cần cập nhật, sửa ở đâu**

| Việc cần làm | Sửa ở đâu | Cần sửa code? |
| --- | --- | --- |
| Thêm hoặc sửa Solution, Project, Segment, News, Job | Thư mục `content/<loại>/<slug>/` (cả `en.mdx` và `vi.mdx`) và ảnh trong `public/images/<loại>/<slug>/` | Không |
| Thêm hoặc sửa đối tác | `content/partners.json` và logo trong `public/images/partners/` | Không |
| Đổi chữ giao diện: nút, nhãn, thông báo lỗi | `messages/en.json` và `messages/vi.json` | Không |
| Đổi tên công ty, menu, liên hệ, mạng xã hội | `site.config.ts` | Không |
| Đổi màu, font, khoảng cách | Design token trong `app/globals.css` | Sửa một chỗ |
| Thêm ngôn ngữ mới | Locale trong `site.config.ts`, file `messages/<mã>.json`, bản `<mã>.mdx` cho từng bản ghi | Ít |
| Thêm loại nội dung mới | Schema trong `lib/content.ts`, thư mục `content/<loại>/`, route trong `app/[locale]/` | Có |
| Thêm khối mới cho trang chủ | Component trong `components/sections/`, ghép vào `app/[locale]/page.tsx` | Có |

**Quy trình mỗi lần cập nhật**

1. Tạo một nhánh git riêng cho lần cập nhật.
2. Mở pull request: CI chạy `npm run check` và Vercel tạo bản xem trước.
3. Xem bản xem trước ở cả `/en` và `/vi`, rồi gộp vào `main` để lên production.
4. Mỗi quý chạy `npm outdated`, nâng thư viện, rồi chạy lại `npm run check` và `npm run build`.

Khi người cập nhật nội dung không dùng git, thay phần đọc trong `lib/content.ts` bằng một headless CMS (Sanity, Payload hoặc Strapi); route và component giữ nguyên.

## Trang chủ và thiết kế

Trang chủ gồm 8 khối, theo thứ tự từ trên xuống:

1. **Hero:** tiêu đề lớn hai dòng, một câu mô tả, hai nút (CTA chính tới `/contact`, CTA phụ tới `/solutions`), ảnh nền toàn chiều rộng bằng ảnh placeholder.
2. **Giới thiệu:** tiêu đề phụ, 2–3 đoạn ngắn và 6–9 từ khoá năng lực dạng chip.
3. **Lưới giải pháp:** 6 thẻ lấy từ loại Solution, mỗi thẻ có tên, một dòng mô tả và link tới trang chi tiết.
4. **Năng lực:** một câu trích dẫn lớn, một đoạn văn, hai nút About us và Contact us.
5. **Dự án tiêu biểu:** tối đa 3 dự án có `featured: true`, kèm nút xem tất cả dự án.
6. **Ba gói sản phẩm:** 3 thẻ ngang cho 3 gói đóng gói sẵn (tên mẫu Package A, B, C), mỗi thẻ có hình và nút.
7. **CTA cuối trang:** một dải màu chủ đạo (nền xanh, chữ trắng) kêu gọi liên hệ.
8. **Footer:** 4 cột (liên kết chính, công ty, liên hệ, mạng xã hội), dòng bản quyền, link Privacy, Cookies, Sitemap.

**Quy tắc giao diện**

- Phong cách tối giản: nhiều khoảng trắng, tiêu đề chữ lớn và đậm, ảnh lớn, bố cục dạng thẻ; bảng màu lấy nguyên từ dự án cũ (xanh chủ đạo trên nền xanh nhạt, chữ xanh đen), không thêm màu mới.
- Menu: Home, Company (About us, Partners, News, Jobs), Segments (dropdown theo từng lĩnh vực), Solutions, Projects, Contact, cộng nút chuyển ngôn ngữ EN/VI. Trên điện thoại là menu toàn màn hình.
- Mobile-first; kiểm tra ở 375, 768 và 1280 px, không có thanh cuộn ngang.
- Không chặn zoom: không đặt `user-scalable=no` hay `maximum-scale`.
- Chuyển động nhẹ (hiện dần khi cuộn), tắt khi người dùng bật `prefers-reduced-motion`.
- Độ tương phản chữ và nền tối thiểu 4.5:1; mọi ảnh có `alt`; điều hướng được bằng bàn phím và có trạng thái focus rõ.

## SEO, pháp lý và nội dung mẫu

**SEO và hiệu năng**

- Mỗi trang có `title`, `description`, canonical, Open Graph và `hreflang` cho `en` và `vi`.
- Tự sinh `sitemap.xml` và `robots.txt`; trang chủ có JSON-LD kiểu `Organization`.
- Lighthouse trên mobile cho trang chủ: Performance, Accessibility, Best Practices và SEO đều từ 90 trở lên.
- Ảnh dùng `next/image` với kích thước khai báo sẵn để không nhảy bố cục.

**Cookie và quyền riêng tư**

- Banner cookie: mặc định chỉ cookie thiết yếu, không nạp analytics trước khi người dùng đồng ý.
- Chỗ gắn analytics là một component rỗng, bật bằng biến môi trường.
- Form liên hệ có ô đồng ý với Privacy policy; không lưu dữ liệu lead ở đâu ngoài email gửi đi.

**Nội dung mẫu và bản quyền**

- Mọi chữ và số liệu mẫu phải là placeholder nhìn rõ là placeholder (ví dụ `[Mô tả giải pháp]`); không bịa số liệu, tên khách hàng thật hay chứng nhận.
- Ảnh: dùng ảnh giữ lại từ dự án cũ theo mục Tài sản giữ lại từ dự án cũ; chỉ khi thiếu ảnh mới dùng gradient hoặc SVG tự tạo trong `public/placeholders/`; không tải ảnh từ web về.
- Được tham khảo cấu trúc của website connect-d.tech, nhưng không sao chép văn bản, hình ảnh, logo, tên sản phẩm hay mã nguồn của họ.
- Trang Privacy và Cookies là bản mẫu, đánh dấu rõ cần pháp chế thẩm định trước khi chạy thật.

## Quy trình thực hiện

Làm lần lượt 9 giai đoạn, từ 0 đến 8. Mỗi giai đoạn kết thúc bằng một cổng **Xong khi** và một commit; chưa qua cổng thì chưa sang giai đoạn sau. Tick từng việc trong `BRIEF.md` khi xong. Dự án mới nằm trong thư mục `networkai-site`, tách hẳn với repo cũ. Kẹt ở một lỗi sau 3 cách sửa khác nhau thì ghi vào báo cáo cuối và đi tiếp phần không phụ thuộc vào lỗi đó.

### Giai đoạn 0. Chuẩn bị

- [x] Kiểm tra `node -v` (cần Node 20 trở lên), `npm -v` và `git --version`; thiếu một trong ba thì dừng và báo.
- [x] Đọc hết brief này, kỹ nhất là mục Tham số dự án và Tài sản giữ lại từ dự án cũ.
- [x] Tạo thư mục `networkai-site` chứa `BRIEF.md`, chạy `git init` và commit đầu tiên chỉ có `BRIEF.md`.

**Xong khi:** ba lệnh kiểm tra phiên bản chạy được và repo mới có đúng một commit. Commit: `chore: init repo with brief`.

### Giai đoạn 1. Khung dự án và đa ngôn ngữ

- [x] Chạy `npx create-next-app@latest` ngay trong thư mục dự án với TypeScript, ESLint, Tailwind, App Router, không dùng thư mục `src`, alias `@/*`, npm. Nếu bị từ chối vì thư mục không rỗng thì khởi tạo vào thư mục tạm rồi chuyển file sang.
- [x] Đọc `AGENTS.md` nếu create-next-app sinh ra, và đọc tài liệu trong `node_modules/next/dist/docs/` nếu có trước khi viết code Next, vì bản mới có thể khác những gì đã biết.
- [x] Cài `next-intl`, `zod`, `react-hook-form`, `@hookform/resolvers`, `resend`, `gray-matter`, `next-mdx-remote`; cài dev `sharp` và `@playwright/test`. Ghi lý do từng thư viện vào README.
- [x] Dựng đúng cây thư mục ở mục Cấu trúc thư mục và cách cập nhật, cùng `site.config.ts`, `.env.example` (`RESEND_API_KEY`, `CONTACT_TO_EMAIL=sales@networkai.vn`, `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL`) và `.github/workflows/ci.yml`.
- [x] Dựng định tuyến `app/[locale]/` bằng `next-intl` cho `en` và `vi`, cùng `messages/en.json`, `messages/vi.json` và trang chủ rỗng ở cả hai ngôn ngữ. Làm đa ngôn ngữ ngay từ đây để khỏi sửa lại toàn bộ route về sau.
- [x] Thêm script `check` (ESLint và `tsc --noEmit`) và `test:e2e` vào `package.json`.

**Xong khi:** `npm run dev` mở được `/en` và `/vi`, `npm run check` qua. Commit: `chore: scaffold project`.

### Giai đoạn 2. Nhập ảnh và email từ dự án cũ

- [x] Clone nông repo cũ vào một thư mục tạm nằm ngoài dự án mới: `GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 https://github.com/letatkhoa3000/networkai-full <thư-mục-tạm>`. Ghi commit bằng `git rev-parse --short HEAD`; nếu khác `a71ae97` thì đối chiếu số file với bảng ở mục Tài sản và ghi chênh lệch vào Assumptions.
- [x] Bỏ bản trùng nội dung bằng `md5sum`, bỏ 5 file mẫu của Next.js, rồi copy ảnh vào đúng thư mục đích trong bảng ở mục Tài sản.
- [x] Viết `scripts/optimize-images.mjs` bằng `sharp`: ảnh chụp rộng tối đa 1920 px, WebP chất lượng 80, mỗi file dưới 300 KB; giữ nguyên SVG và PNG logo. Chạy script cho `public/images/`.
- [x] Mở xem từng ảnh, đặt lại tên kebab-case theo nội dung, rồi ghi vào README mục Assets: tên file, dùng ở đâu, `alt` tiếng Anh và tiếng Việt.
- [x] Đưa email vào `site.config.ts` và `.env.example`, rồi xoá thư mục clone tạm. Không giữ file nào khác của dự án cũ.

**Xong khi:** `public/images/` có đủ các nhóm `brand`, `projects`, `home`, `solutions`, `partners`; mọi file dưới 300 KB (trừ logo); `git status` chỉ có ảnh, script, README và hai file cấu hình email. Commit: `chore: import assets from legacy site`.

### Giai đoạn 3. Design token và khung trang

- [x] Đặt bảng Tông màu giữ lại ở mục Tài sản, cùng font (một sans-serif hỗ trợ tiếng Việt) và khoảng cách thành design token trong `app/globals.css`. Mở xem logo NetworkAI để kiểm tra hợp màu; nếu logo lệch màu thì vẫn giữ bảng màu và ghi vào Assumptions.
- [x] Dựng `Container`, `Section`, `Button`, `Card`, `Chip`, `Header` (menu dropdown, đổi ngôn ngữ, menu toàn màn hình trên điện thoại), `Footer` và `CookieBanner`.
- [x] Chụp màn hình khung trang bằng Playwright ở 375, 768 và 1280 px, mở xem và sửa lỗi bố cục.

**Xong khi:** khung hiển thị đúng ở ba cỡ màn hình, không có thanh cuộn ngang và màu khớp bảng Tông màu giữ lại. Commit: `feat: layout and design tokens`.

### Giai đoạn 4. Lớp nội dung và dữ liệu mẫu

- [ ] Viết Zod schema cho 6 loại nội dung và `lib/content.ts` đọc MDX và JSON; thiếu bản `vi` thì dùng bản `en`.
- [ ] Tạo dữ liệu mẫu bằng `en` và `vi`: 6 solution, 2 segment, 3 project, 3 news, 2 job và danh sách partner từ logo đã nhập. Chữ là placeholder (ví dụ `[Mô tả giải pháp]`), ảnh lấy từ `public/images/`.
- [ ] Viết script kiểm tra nội dung và gộp vào `npm run check`: mọi bản ghi qua Zod, mọi đường dẫn ảnh tồn tại, mọi ảnh có `alt`.

**Xong khi:** mọi route danh sách và chi tiết đọc được dữ liệu, script kiểm tra nội dung qua. Commit: `feat: content layer and sample data`.

### Giai đoạn 5. Trang chủ và các trang còn lại

- [ ] Dựng trang chủ đủ 8 khối, đúng thứ tự trong mục Trang chủ và thiết kế.
- [ ] Dựng about, partners, segments, solutions, projects, news, jobs, privacy-policy, cookies và sitemap, mỗi trang đủ hai ngôn ngữ.
- [ ] Bấm thử mọi link trong Header, Footer và CTA.

**Xong khi:** 17 route mở được ở cả `/en` và `/vi`, không có route nào trả 404 và không có link nội bộ gãy. Commit: `feat: pages`.

### Giai đoạn 6. Form liên hệ

- [ ] Dựng form với họ tên, công ty, email, điện thoại, nội dung và ô đồng ý chính sách; kiểm tra bằng Zod ở cả client và server.
- [ ] Viết `app/api/contact/route.ts`: honeypot, giới hạn tốc độ theo IP, gửi email qua Resend tới `CONTACT_TO_EMAIL`. Thiếu `RESEND_API_KEY` thì ghi log phía server và báo thành công ở môi trường dev, báo lỗi rõ ở production. Giới hạn tốc độ làm trong bộ nhớ; ghi hạn chế này vào README.
- [ ] Thêm trạng thái đang gửi, thành công và lỗi, thông báo bằng hai ngôn ngữ.

**Xong khi:** gửi thử ở môi trường dev ghi ra log đúng nội dung, dữ liệu sai bị chặn với thông báo rõ. Commit: `feat: contact form`.

### Giai đoạn 7. SEO, cookie và pháp lý

- [ ] Thêm metadata, canonical, Open Graph, `hreflang`, `sitemap.ts`, `robots.ts`, JSON-LD kiểu `Organization` và ảnh OG.
- [ ] Banner cookie mặc định chỉ cookie thiết yếu; chỗ gắn analytics là một component rỗng, bật bằng biến môi trường.
- [ ] Viết trang Privacy và Cookies bản mẫu, có dòng ghi rõ cần pháp chế thẩm định.
- [ ] Chạy Lighthouse mobile cho trang chủ. Nếu môi trường không chạy được thì nói rõ điều đó trong báo cáo cuối, không bỏ qua âm thầm.

**Xong khi:** Lighthouse mobile của trang chủ từ 90 trở lên ở cả 4 mục, hoặc báo cáo nêu rõ vì sao chưa đo được. Commit: `feat: seo and consent`.

### Giai đoạn 8. Kiểm thử, README và báo cáo

- [ ] Viết Playwright smoke test: trang chủ `/en` và `/vi`, một trang chi tiết mỗi loại, gửi form thành công và thất bại.
- [ ] Chạy `npm run check`, `npm run build` và `npm run test:e2e` cho đến khi cả ba sạch.
- [ ] Viết README: cách chạy, biến môi trường, bảng việc cần làm và nơi sửa, cách thêm một Solution mới, Assets, Assumptions và các hạn chế đã biết.
- [ ] Viết báo cáo cuối: giai đoạn nào xong, giai đoạn nào chưa, giả định đã dùng, ảnh không dùng và việc cần người làm (khoá Resend, quyền dùng logo đối tác, thẩm định pháp lý, domain).

**Xong khi:** đủ 6 điều ở mục Tiêu chí nghiệm thu. Commit: `docs: readme and final checks`.

## Tiêu chí nghiệm thu và quy tắc làm việc

**Bản giao đạt khi đủ cả 6 điều**

- `npm run check` và `npm run build` chạy sạch, không còn lỗi TypeScript.
- 17 route đều mở được ở cả `/en` và `/vi`.
- Form liên hệ kiểm tra dữ liệu đúng và gửi được, hoặc ghi log khi thiếu `RESEND_API_KEY`.
- Lighthouse mobile của trang chủ từ 90 trở lên ở cả 4 mục.
- Không còn chuỗi hard-code, không có nội dung hay ảnh sao chép từ connect-d.tech, và từ dự án cũ chỉ có ảnh, email liên hệ và tông màu.
- README nêu cách chạy, các biến môi trường, bảng "việc cần làm và nơi sửa", cách thêm một Solution mới và mục Assumptions.

**Quy tắc làm việc cho Claude Code**

- Làm một lượt từ đầu đến cuối theo mục Quy trình thực hiện. Gặp chỗ chọn được giá trị mặc định hợp lý thì chọn và ghi vào Assumptions, không dừng lại hỏi.
- Chỉ dừng hỏi khi thiếu thứ không tự quyết được, như khoá API thật hoặc tên pháp lý của công ty.
- Không tự deploy, không tự đăng ký dịch vụ, không đưa khoá bí mật vào repo.
- Mỗi giai đoạn một commit, dùng đúng thông điệp ghi ở cổng Xong khi.
- Kết thúc bằng một báo cáo ngắn: việc nào xong, việc nào chưa, giả định nào đã dùng.

**Cách giao việc**

Lưu nội dung doc này vào thư mục dự án (ví dụ `BRIEF.md`), rồi dán câu sau vào Claude Code:

```text
Đọc kỹ BRIEF.md. Thực hiện toàn bộ mục "Quy trình thực hiện" từ giai đoạn 0 đến giai đoạn 8 theo đúng "Quy tắc làm việc". Không hỏi lại trừ khi thiếu thứ không thể tự quyết. Làm xong thì báo cáo ngắn theo quy tắc trong brief.
```
