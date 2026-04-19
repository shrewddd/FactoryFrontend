import { DataTable } from "@/components/data-table"
import { QRCodeForm } from "@/components/forms/qrcode"
import { useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getColumns, printMultipleQRCodes } from "./columns"  // import new fn
import { Dialog, DialogHeader, DialogTitle, DialogContent } from "@/components/ui/dialog"
import type { QRCode } from "@/types/qrcode"
import { ActivateQRCodeForm } from "@/components/forms/activateQRCode"
import { useGetAllQRCodes } from "@/hooks/useQR"
import { QRCodeCanvas } from 'qrcode.react';
import { BASE_URL } from "@/config"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import type { Table } from "@tanstack/react-table"

export const QrCodeGenerationPage = () => {
  const { data: qrcodes, isLoading, refetch } = useGetAllQRCodes()
  const [activateOpen, setActivateOpen] = useState(false)
  const [seeOpen, setSeeOpen] = useState(false)
  const [activeQRCode, setActiveQRCode] = useState<QRCode | null>(null)
  const tableRef = useRef<Table<QRCode>>(null)  // ref to access table instance

  const openActivateDialog = (qr: QRCode) => {
    setActiveQRCode(qr)
    setActivateOpen(true)
  }

  const openSeeDialog = (qr: QRCode) => {
    setActiveQRCode(qr)
    setSeeOpen(true)
  }

  const navigate = useNavigate();
  const columns = useMemo(() => getColumns(openActivateDialog, openSeeDialog), [navigate]);

  const handlePrintSelected = () => {
    if (!tableRef.current) return;
    const selected = tableRef.current
      .getFilteredSelectedRowModel()
      .rows.map((r) => r.original);
    if (selected.length > 0) printMultipleQRCodes(selected);
  };

  const [selectedCount, setSelectedCount] = useState(0);

  const toolbarExtras = (
    <Button
      variant="outline"
      size="sm"
      disabled={selectedCount === 0}
      onClick={handlePrintSelected}
    >
      <Printer className="mr-2 h-4 w-4" />
      Print Selected {selectedCount > 0 && `(${selectedCount})`}
    </Button>
  );

  if (isLoading) {
    return <div>Loading</div>
  }

  return (
    <div>
      <DataTable
        columns={columns}
        searchValues={"name"}
        data={qrcodes ?? []}
        contentForm={<QRCodeForm onSuccess={() => { refetch() }} />}
        toolbarExtras={toolbarExtras}
        tableRef={tableRef}
        onRowSelectionChange={setSelectedCount}
      />    <Dialog open={activateOpen} onOpenChange={setActivateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Activate QR Code</DialogTitle>
          </DialogHeader>
            {activeQRCode && (
              <ActivateQRCodeForm
                qrcode={activeQRCode}
                onDone={() => setActivateOpen(false)}
              />
            )}
        </DialogContent>
      </Dialog>
       <Dialog open={seeOpen} onOpenChange={setSeeOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>QR Code</DialogTitle>
            </DialogHeader>
            {activeQRCode && 
            (<QRCodeCanvas style={{ width: '100%', height: '100%' }} className="border-4 rounded-xl p-8 bg-white" value={activeQRCode.resource || `${BASE_URL}/qrcodes/${activeQRCode.id}`} size={300} level="M" />)}
          </DialogContent>
        </Dialog>
    </div>
  )
}
