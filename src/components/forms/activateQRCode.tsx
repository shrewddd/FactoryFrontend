import { useState } from "react";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Button } from "../ui/button";
import type { QRCode } from "@/types/qrcode";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { BASE_URL } from "@/config";
import { useGetAllBatches } from "@/hooks/useBatch";
import { useActivateQRCode } from "@/hooks/useQR";
import { useGetAllQRCodes } from "@/hooks/useQR";
import { useAuth } from "@/AuthProvider";

interface QRCodeFormProps {
  qrcode: QRCode;
  onDone: () => void;
}

export const ActivateQRCodeForm = ({ qrcode, onDone }: QRCodeFormProps) => {
  const { user } = useAuth();
  const [linkedBatch, setLinkedBatch] = useState("");
  const { data: rawBatches, isLoading: batchesLoading } = useGetAllBatches();
  const { data: qrcodes, isLoading: qrLoading } = useGetAllQRCodes();

  const batches = rawBatches?.filter(batch => batch.isActive === true && batch.status.label !== "Completed");

  const isLoading = batchesLoading || qrLoading;

  const takenResources = new Set(
    (qrcodes ?? [])
      .filter((qr) => qr.resource && qr.id !== qrcode.id) // exclude current QR's own resource
      .map((qr) => qr.resource)
  );

  const normalizedBatches = isLoading
    ? []
    : (
        user?.lastName === "super"
          ? batches
          : batches?.filter((batch) => batch.status.label === "Inactive")
      )?.filter((batch) => {
        const batchUrl = `${BASE_URL}/batch/${batch.id}`;
        return !takenResources.has(batchUrl);
      }) ?? [];

  const { mutate: activateQRCode, isPending } = useActivateQRCode();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    activateQRCode(
      { id: qrcode.id, resource: linkedBatch },
      {
        onSuccess: () => onDone(),
        onError: (error) => console.log("Failed to activate QR code:", error),
      },
    );
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <FieldSet>
        <FieldLegend>QR-Code Information</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Product</FieldLabel>
            <Select value={linkedBatch} onValueChange={setLinkedBatch}>
              <SelectTrigger>
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent>
                {normalizedBatches.map((batch) => (
                  <SelectItem
                    key={batch.name}
                    value={`${BASE_URL}/batch/${String(batch.id)}`}
                  >{`ID: ${batch.id} | Name: ${batch.name} | Product: ${batch.product.id} | Size: ${batch.size}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </FieldSet>
      <Button type="submit" disabled={isPending || !linkedBatch}>
        {isPending ? "Activating..." : "Initialize"}
      </Button>
    </form>
  );
};
