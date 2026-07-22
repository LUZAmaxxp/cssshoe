"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit, Archive, Unarchive } from "@mui/icons-material";

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  isArchived: boolean;
  viewCount: number;
  likeCount: number;
  images: string[];
}

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "rgba(99,153,34,0.12)", text: "#3b6d11" },
  archived: { bg: "rgba(26,26,26,0.06)", text: "#6b6b6b" },
};

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = () => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleArchive = async (id: string, isArchived: boolean) => {
    await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isArchived: !isArchived }),
    });
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Products
        </Typography>
        <Link href="/admin/products/new">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#722f37",
              "&:hover": { backgroundColor: "#1a1a1a" },
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Add Product
          </Button>
        </Link>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={60}></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>Likes</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const status = product.isArchived ? "archived" : "active";
              const s = statusColors[status];
              return (
                <TableRow key={product._id}>
                  <TableCell>
                    {product.images?.[0] ? (
                      <div className="relative w-10 h-10 rounded-md overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-xs font-heading text-muted-foreground">
                        M
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.viewCount}</TableCell>
                  <TableCell>{product.likeCount}</TableCell>
                  <TableCell>
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium"
                      style={{ backgroundColor: s.bg, color: s.text }}
                    >
                      {status}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <Link href={`/admin/products/${product._id}`}>
                      <IconButton size="small">
                        <Edit fontSize="small" />
                      </IconButton>
                    </Link>
                    <IconButton
                      size="small"
                      onClick={() => toggleArchive(product._id, product.isArchived)}
                    >
                      {product.isArchived ? (
                        <Unarchive fontSize="small" />
                      ) : (
                        <Archive fontSize="small" />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}