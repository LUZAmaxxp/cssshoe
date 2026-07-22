"use client";

import { useCartStore } from "@/stores/cart";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/i18n/context";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const { t } = useLocale();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-heading">{t("cart.title")}</h2>
              <button onClick={onClose} className="p-2 -mr-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {t("cart.empty")}
                </p>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.size}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 border-b pb-4"
                    >
                      <div className="w-16 h-16 bg-muted flex-shrink-0 flex items-center justify-center text-xs font-heading">
                        M
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {t("cart.size")}: {item.size}
                        </p>
                        <p className="text-sm mt-1">${item.price}</p>

                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            className="p-2 border rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            className="p-2 border rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeItem(item.productId, item.size)}
                            className="ml-auto p-2 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="flex justify-between text-lg font-medium">
                  <span>{t("cart.total")}</span>
                  <span>${totalPrice()}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full bg-burgundy text-white text-center py-3.5 text-sm tracking-widest uppercase hover:bg-charcoal transition-colors"
                >
                  {t("cart.checkout")}
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
