"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBag, User, Globe } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { SearchModal } from "@/components/layout/SearchModal";
import { useLocale } from "@/i18n/context";
import { locales, localeMetadata } from "@/i18n/config";

export function Navbar({ alwaysSolid = false }: { alwaysSolid?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItemsCount = useCartStore((s) => s.totalItems());
  const { locale, setLocale, t } = useLocale();

  useEffect(() => {
    if (alwaysSolid) return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysSolid]);

  useEffect(() => {
    const handleClick = () => setLangOpen(false);
    if (langOpen) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [langOpen]);

  const isSolid = alwaysSolid || scrolled;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isSolid
            ? "bg-charcoal border-b border-cream/10"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4 md:px-8">
          <Link href="/" className="flex items-center gap-1.5">
            <Image
              src="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804013/lyzane/logo1v1.png"
              alt="Lyzane"
              width={120}
              height={40}
              className="h-7 md:h-8 w-auto"
              priority
            />
            <Image
              src="https://res.cloudinary.com/dzrsbjdma/image/upload/v1784804014/lyzane/title-nobg.png"
              alt="Lyzane"
              width={250}
              height={50}
              className="h-5 md:h-6 w-auto hidden sm:block"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.15em] uppercase text-cream/70">
            <Link href="/shop" className="text-cream/70 hover:text-cream transition-colors">
              {t("nav.shop")}
            </Link>
            <Link href="/#philosophy" className="text-cream/70 hover:text-cream transition-colors">
              {t("nav.ourStory")}
            </Link>
            <Link href="/#craft" className="text-cream/70 hover:text-cream transition-colors">
              {t("nav.craft")}
            </Link>
            <Link href="/#journal" className="text-cream/70 hover:text-cream transition-colors">
              {t("nav.journal")}
            </Link>
          </div>

          <div className="flex items-center gap-3 text-cream/70">
            <span className="hidden md:block">
              <SearchModal />
            </span>
            <button className="hidden md:block p-2 hover:text-cream transition-colors">
              <User className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <div className="relative hidden md:block">
              <button
                onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }}
                className="p-2 hover:text-cream transition-colors flex items-center gap-1 text-[11px] tracking-[0.1em] uppercase"
              >
                <Globe className="w-3.5 h-3.5" />
                {locale.toUpperCase()}
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 bg-charcoal border border-cream/10 py-1 min-w-[100px]">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => { setLocale(loc); setLangOpen(false); }}
                      className={`block w-full text-left px-3 py-1.5 text-[11px] tracking-[0.1em] uppercase transition-colors ${
                        locale === loc ? "text-brass" : "text-cream/70 hover:text-cream"
                      }`}
                    >
                      {localeMetadata[loc].name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setCartOpen(true)} className="relative p-2 hover:text-cream transition-colors">
              <ShoppingBag className="w-4 h-4" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-burgundy text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItemsCount}
                </span>
              )}
            </button>

            <button className="md:hidden p-2 hover:text-cream transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-charcoal/95 backdrop-blur-sm border-t border-cream/10 px-4 py-6 min-h-[calc(100vh-64px)] space-y-4">
            <div className="md:hidden">
              <SearchModal />
            </div>
            <Link href="/shop" className="block text-[11px] tracking-[0.15em] uppercase text-cream/70 hover:text-cream" onClick={() => setMenuOpen(false)}>
              {t("nav.shop")}
            </Link>
            <Link href="/#philosophy" className="block text-[11px] tracking-[0.15em] uppercase text-cream/70 hover:text-cream" onClick={() => setMenuOpen(false)}>
              {t("nav.ourStory")}
            </Link>
            <Link href="/#craft" className="block text-[11px] tracking-[0.15em] uppercase text-cream/70 hover:text-cream" onClick={() => setMenuOpen(false)}>
              {t("nav.craft")}
            </Link>
            <Link href="/#journal" className="block text-[11px] tracking-[0.15em] uppercase text-cream/70 hover:text-cream" onClick={() => setMenuOpen(false)}>
              {t("nav.journal")}
            </Link>
            {/* Mobile language switcher */}
            <div className="pt-4 border-t border-cream/10">
              <p className="text-[10px] tracking-[0.15em] uppercase text-cream/40 mb-3">Language</p>
              <div className="flex gap-4">
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => { setLocale(loc); setMenuOpen(false); }}
                    className={`text-[11px] tracking-[0.1em] uppercase transition-colors ${
                      locale === loc ? "text-brass" : "text-cream/70 hover:text-cream"
                    }`}
                  >
                    {localeMetadata[loc].name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
