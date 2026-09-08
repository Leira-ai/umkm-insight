import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { findProduct, transactions } from "@/lib/demo-data";

export async function generateMetadata({ params }: { params: Promise<{ sku: string }> }): Promise<Metadata> { const { sku } = await params; const product = findProduct(decodeURIComponent(sku).toUpperCase()); return { title: product?.name ?? "Produk tidak ditemukan" }; }
export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) { const { sku } = await params; const product = findProduct(decodeURIComponent(sku).toUpperCase()); if (!product) notFound(); return <ProductDetail product={product} transactions={transactions.filter((item) => item.sku === product.sku)} />; }
