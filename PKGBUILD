# Maintainer: Devank <devank@mosaic.local>
pkgname=mosaic
pkgver=1.0.0
pkgrel=1
pkgdesc="Personal Life Operating System & Productivity Suite with Local SQLite Database"
arch=('x86_64')
url="https://github.com/notdevank/Mosaic"
license=('MIT')
depends=('webkit2gtk-4.1' 'gtk3' 'sqlite' 'openssl')
makedepends=('cargo' 'nodejs' 'npm')

build() {
  npm run tauri build
}

package() {
  install -Dm755 "src-tauri/target/release/mosaic" "$pkgdir/usr/bin/mosaic"
  install -Dm644 "mosaic.desktop" "$pkgdir/usr/share/applications/mosaic.desktop"
}
