import React from "react";
import Link from "next/link";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

export const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-bold truncate">
          {product.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1 truncate">
          {product.description}
        </p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-lg font-bold">
            ₦{product.price.toLocaleString()}
          </span>
          <Badge variant="secondary">MOQ: {product.minOrderQuantity}</Badge>
        </div>
        <Badge variant="outline" className="mt-2">
          {product.supplier.name}
        </Badge>
      </CardContent>
      <CardFooter className="p-4">
        <Button
          className="w-full bg-primary hover:bg-primary/90"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
