
### Backend API
const API_BASE_URL = 'http://localhost:3000/api/v1';



Proje kök dizininde .env adında bir dosya oluşturabilirsinz ve içine aşağıdaki gibi ayar ekle (istğe bağlı)
örn:
PORT=4001


### Kurulum ve Çalıştırma

```bash
pnpm install
pnpm dev
```

Alternatif olarak:

- npm: `npm install && npm run dev`
- yarn: `yarn && yarn dev`

### Scriptler

- `pnpm dev`: Geliştirme sunucusu (Turbopack)
- `pnpm build`: Production build
- `pnpm start`: Production sunucusu
- `pnpm lint`: ESLint kontrolü