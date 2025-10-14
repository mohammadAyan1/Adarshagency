import { Dialog, DialogContent } from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BillModel = ({ passBillModelData, setShowModel }) => {
  console.log(passBillModelData);

  return (
    <Dialog defaultOpen={true} onOpenChange={() => setShowModel(false)}>
      <DialogContent className="sm:max-w-[700px]">
        {/* <div className="w-full max-w-6xl mx-auto">
          <div className="max-h-[400px] overflow-y-auto"> */}
        <Table className="w-full max-w-6xl mx-auto">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>SR NO.</TableHead>
              {/* <TableHead>Bill No.</TableHead> */}
              <TableHead>Product Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Free</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Scheme %</TableHead>
              <TableHead>Scheme</TableHead>
              <TableHead>CD %</TableHead>
              <TableHead>CDAMT</TableHead>
              <TableHead>GST</TableHead>
              <TableHead>Tatal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {passBillModelData?.billing?.map((item, index) => (
              <TableRow>
                <TableCell className="font-medium">{index + 1}</TableCell>
                {/* <TableCell>{item?.sch}</TableCell> */}
                <TableCell>{item?.itemName}</TableCell>
                <TableCell>{item?.qty}</TableCell>
                <TableCell>{item?.unit}</TableCell>
                <TableCell>{item?.Free}</TableCell>
                <TableCell>{item?.rate}</TableCell>
                <TableCell>{item?.sch}</TableCell>
                <TableCell>{item?.schAmt?.toFixed(2)}</TableCell>
                <TableCell>{item?.cd}</TableCell>
                <TableCell>{item?.cdAmt}</TableCell>
                <TableCell>{item?.gst}</TableCell>
                {/* <TableCell>{item?.total.toFixed(2)}</TableCell> */}
                <TableCell>{Number(item?.total || 0).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* </div>
        </div> */}
      </DialogContent>
    </Dialog>
  );
};

export default BillModel;
