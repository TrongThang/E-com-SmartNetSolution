import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function ConfirmationDialog({ title, open, onOpenChange, count, type, onSubmit }) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận {title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn có chắc chắn muốn tạo phiếu xuất kho cho {count} {type} này? Hành động này không
                        thể hoàn tác.
                    </AlertDialogDescription>
            </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="border-red-500 text-red-500">Hủy</AlertDialogCancel>
                    <AlertDialogAction onClick={onSubmit} className="bg-blue-500 text-white">Xác nhận</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}