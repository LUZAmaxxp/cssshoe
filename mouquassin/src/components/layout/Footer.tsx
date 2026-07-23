"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/i18n/context";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-border bg-charcoal md:bg-cream">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand column */}
          <div>
            <Image
              src="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804013/lyzane/logo1v1.png"
              alt="Lyzane"
              width={100}
              height={35}
              className="h-8 w-auto mb-3"
            />
            <p className="text-[10px] tracking-[0.3em] uppercase text-cream/50 md:text-muted-foreground mb-3">
              {t("footer.tagline")}
            </p>
            <p className="text-sm text-cream/60 md:text-muted-foreground leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Shop column */}
          <div>
            <h4 className="text-[10px] tracking-[0.15em] uppercase font-sans font-normal text-cream md:text-charcoal mb-3">
              {t("footer.shop.title")}
            </h4>
            <div className="space-y-2">
              <Link href="/shop" className="block text-xs text-cream/60 md:text-muted-foreground hover:text-cream md:hover:text-charcoal transition-colors no-underline">
                {t("footer.shop.allProducts")}
              </Link>
              <Link href="/shop?category=loafers" className="block text-xs text-cream/60 md:text-muted-foreground hover:text-cream md:hover:text-charcoal transition-colors no-underline">
                {t("footer.shop.loafers")}
              </Link>
              <Link href="/shop?category=oxfords" className="block text-xs text-cream/60 md:text-muted-foreground hover:text-cream md:hover:text-charcoal transition-colors no-underline">
                {t("footer.shop.oxfords")}
              </Link>
            </div>
          </div>

          {/* Help column */}
          <div>
            <h4 className="text-[10px] tracking-[0.15em] uppercase font-sans font-normal text-cream md:text-charcoal mb-3">
              {t("footer.help.title")}
            </h4>
            <div className="space-y-2">
              <Link href="/#values" className="block text-xs text-cream/60 md:text-muted-foreground hover:text-cream md:hover:text-charcoal transition-colors no-underline">
                {t("footer.help.ourStory")}
              </Link>
              <Link href="/checkout" className="block text-xs text-cream/60 md:text-muted-foreground hover:text-cream md:hover:text-charcoal transition-colors no-underline">
                {t("footer.help.placeOrder")}
              </Link>
              <p className="block text-xs text-cream/60 md:text-muted-foreground">{t("footer.help.shipping")}</p>
            </div>
          </div>

          {/* Stay Connected column */}
          <div>
            <h4 className="text-[10px] tracking-[0.15em] uppercase font-sans font-normal text-cream md:text-charcoal mb-3">
              {t("footer.connected.title")}
            </h4>
            <p className="text-xs text-cream/60 md:text-muted-foreground mb-4">
              {t("footer.connected.subscribe")}
            </p>
            <div className="flex gap-2 mb-6">
              <input
                type="email"
                placeholder={t("footer.connected.emailPlaceholder")}
                className="flex-1 bg-transparent border border-cream/20 md:border-border px-3 py-2 text-xs text-cream md:text-charcoal placeholder:text-cream/40 md:placeholder:text-muted-foreground focus:outline-none focus:border-brass transition-colors"
              />
              <button className="bg-cream text-charcoal md:bg-charcoal md:text-cream px-4 py-2 text-[10px] tracking-[0.15em] uppercase hover:bg-brass hover:text-charcoal transition-colors">
                {t("footer.connected.subscribeButton")}
              </button>
            </div>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/lyzane.co?igsh=Y3l1dHFweXY0MGJz&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cream/60 md:text-muted-foreground hover:text-cream md:hover:text-charcoal transition-colors no-underline"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/share/1BvUC9CRxt/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cream/60 md:text-muted-foreground hover:text-cream md:hover:text-charcoal transition-colors no-underline"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-cream/10 md:border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] tracking-[0.15em] uppercase text-cream/40 md:text-muted-foreground">
            &copy; {new Date().getFullYear()} Lyzane. {t("footer.copyright")}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[10px] tracking-[0.15em] uppercase text-cream/40 md:text-muted-foreground hover:text-cream md:hover:text-charcoal transition-colors no-underline">{t("footer.privacy")}</a>
            <a href="#" className="text-[10px] tracking-[0.15em] uppercase text-cream/40 md:text-muted-foreground hover:text-cream md:hover:text-charcoal transition-colors no-underline">{t("footer.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
