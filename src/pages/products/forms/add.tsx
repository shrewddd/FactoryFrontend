import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import type { ProductInsert } from "@/api/generated/models";
import { Textarea } from "@/components/ui/textarea";
import { SwitchCell } from "@/components/data-table/switch-cell";

interface ProductAddFormProps {
  onSubmit: (data: ProductInsert) => void;
  isPending?: boolean;
}

export const ProductAddForm = ({ onSubmit, isPending }: ProductAddFormProps) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [barCode, setBarCode] = useState("");
  const [boxSize, setBoxSize] = useState("");
  const [isActive, setIsActive] = useState<boolean>(true);

  const [picture, setPicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPicture(file);
  };

  useEffect(() => {
    if (!picture) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(picture);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [picture]);

  return (
    <FieldSet className="p-2">
      <FieldGroup>
        <Field>
          {previewUrl && <img src={previewUrl} alt="Попередній перегляд" className="mt-2 aspect-square rounded-md border object-contain" />}
          <FieldLabel htmlFor="picture">Зображення</FieldLabel>
          <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
          <FieldDescription>Виберіть зображення для завантаження.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="product-name">Назва продукту</FieldLabel>
          <Textarea id="product-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Введіть назву продукту" />
        </Field>
        <Field>
          <FieldLabel htmlFor="product-code">Код продукту</FieldLabel>
          <Textarea id="product-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Введіть код продукту" />
          <FieldDescription>Має бути унікальним</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="product-barcode">Штрихкод</FieldLabel>
          <Input id="product-barcode" type="text" value={barCode} onChange={(e) => setBarCode(e.target.value)} placeholder="Введіть штрихкод" />
        </Field>
        <Field>
          <FieldLabel htmlFor="product-box-size">Розмір коробки</FieldLabel>
          <Input id="product-box-size" type="number" min={1} value={boxSize} onChange={(e) => setBoxSize(e.target.value)} placeholder="Введіть розмір коробки" />
        </Field>
        <Field className="flex flex-row justify-center">
          <FieldLabel htmlFor="product-is-active">Актуальний</FieldLabel>
          <SwitchCell pressed={isActive} onPressed={setIsActive} />
        </Field>
        <Button
          disabled={!name.trim() || isPending}
          onClick={() => onSubmit({
            code: code,
            name,
            barCode: barCode.trim(),
            boxSize: boxSize === "" ? undefined : Number(boxSize),
            isActive,
            measureUnit: { id: 1 },
          })}
        >
          {isPending ? "Триває додавання..." : "Додати"}
        </Button>
      </FieldGroup>
    </FieldSet>
  );
};
