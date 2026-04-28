import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBatches } from "@/hooks/useBatch";
import { useAuth } from "@/AuthProvider";
import { BASE_URL } from "@/config";
import { useQR } from "@/hooks/useQR";
import type { Batch } from "@/types/batches";

const ProductSelectItem = ({ batch }: { batch: Batch }) => {
  return <SelectItem value={String(batch.id)}>{batch.product.name}</SelectItem>;
};

export const QRCodePreviewPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeBatchId, setActiveBatch] = useState<string | undefined>(undefined);

  const { data: batches, isLoading: isBatchLoading } = useBatches.getAll();
  const { data: qrcode, isLoading } = useQR.get(parseInt(id || "0"));
  const { mutate: advance } = useBatches.advance();
  const { mutate: activateQRCode } = useQR.activate();

  if (isLoading || isBatchLoading) {
    return <div>Loading</div>;
  }

  if (id === undefined || isNaN(parseInt(id)) || !user) {
    return <div>Something went wrong</div>;
  }


  const normalizedBatches = batches ?? []

  const savedWorkstationId = Number(localStorage.getItem("workstationId")) ;

  const filteredBatches = normalizedBatches.filter((batch) => batch.status.label === "Inactive" && batch.workstation.id === savedWorkstationId);

  const handleClick = async (e: any) => {
    e.preventDefault();
    if (!activeBatchId) return;
    advance(
      { id: Number(activeBatchId), defects: [] },
      {
        onSuccess: () => {
          activateQRCode({ id: Number(id), resource: `${BASE_URL}/batch/${activeBatchId}` });
          localStorage.removeItem("workstationId");
          navigate(`/batch/${activeBatchId}`);
        },
      },
    );
  };
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{`Привязывание QR-Кода к партии`}</CardTitle>
            </CardHeader>
            <CardContent>
              {!savedWorkstationId ? (
                <div className="flex flex-col gap-2">
                  <p className="text-lg">
                    <strong>Рабочая станция не найдена</strong>
                  </p>
                  <p className="mt-4 text-lg">
                    <strong>Пожалуйста отсканируете свое рабочее место что бы продолжить</strong>
                  </p>
                </div>
              ) : (
                qrcode && (
                  <div className="flex flex-col gap-2">
                    <p className="text-lg">
                      <strong>QR-Код:</strong>
                    </p>
                    <div className="border p-4 rounded-md shadow-sm space-y-2">
                      <p>
                        <strong>ID:</strong> {qrcode.id}
                      </p>
                      <p>
                        <strong>Название:</strong> {qrcode.name}
                      </p>
                    </div>
                    <p className="mt-4 text-md">
                      <strong>Пожалуйста выберите партию что бы продолжить</strong>
                    </p>
                    <Select value={activeBatchId} onValueChange={setActiveBatch}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите партию" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredBatches && filteredBatches.map((batch) => <ProductSelectItem key={batch.id} batch={batch} />)}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleClick}>Подтвердить</Button>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
