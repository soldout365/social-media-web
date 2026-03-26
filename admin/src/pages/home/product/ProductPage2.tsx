import { useState } from "react";
import {
  useGetProducts,
  useSoftDeleteProduct,
  useDeleteMultipleProducts,
  useDeleteProduct,
} from "../../../hooks/useProduct";
import type { TProduct } from "../../../types/product.type";
import ConfirmModal from "../../../components/common/ConfirmModal";

// Components
import ArchiveOSHeader from "./components/ArchiveOSHeader";
import ArchiveOSStats from "./components/ArchiveOSStats";
import ArchiveOSFilterBar from "./components/ArchiveOSFilterBar";
import ArchiveOSTable from "./components/ArchiveOSTable";
import ArchiveOSPagination from "./components/ArchiveOSPagination";
import ArchiveOSFloatingBar from "./components/ArchiveOSFloatingBar";

const ArchiveOS: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // API calls - get deleted products
  const {
    data: productsData,
    isLoading,
    refetch,
  } = useGetProducts({
    _limit: limit,
    _page: page,
    q: searchQuery || undefined,
    deleted: "true", // Get deleted products
  });

  const softDeleteMutation = useSoftDeleteProduct();
  const deleteMultipleMutation = useDeleteMultipleProducts();
  const deleteProductMutation = useDeleteProduct();

  const products: TProduct[] = productsData?.docs || [];

  // Calculate totals
  const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
  const totalStock = products.reduce(
    (sum, p) =>
      sum + (p.sizes?.reduce((s, size) => s + (size.quantity || 0), 0) || 0),
    0,
  );

  // Pagination
  const totalPages = productsData?.totalPages || 1;
  const totalDocs = productsData?.totalDocs || 0;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) setSelectedIds([]);
    else setSelectedIds(products.map((p) => p._id));
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  // Handle restore product (soft delete with toggle - restore)
  const handleRestore = async (productId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Khôi phục sản phẩm",
      description: "Bạn có muốn khôi phục sản phẩm này?",
      onConfirm: async () => {
        try {
          await softDeleteMutation.mutateAsync(productId);
          refetch();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error("Error restoring product:", error);
        }
      },
    });
  };

  // Handle hard delete one product
  const handleHardDelete = async (productId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Xóa vĩnh viễn",
      description:
        "Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm này? Hành động này không thể hoàn tác.",
      onConfirm: async () => {
        try {
          await deleteProductMutation.mutateAsync(productId);
          refetch();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error("Error hard deleting product:", error);
        }
      },
    });
  };

  // Handle hard delete multiple products
  const handleHardDeleteMultiple = async () => {
    setConfirmModal({
      isOpen: true,
      title: "Xóa vĩnh viễn",
      description: `Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedIds.length} sản phẩm? Hành động này không thể hoàn tác.`,
      onConfirm: async () => {
        try {
          await deleteMultipleMutation.mutateAsync(selectedIds);
          setSelectedIds([]);
          refetch();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error("Error hard deleting products:", error);
        }
      },
    });
  };

  // Handle restore multiple products
  const handleRestoreMultiple = async () => {
    try {
      for (const id of selectedIds) {
        await softDeleteMutation.mutateAsync(id);
      }
      setSelectedIds([]);
      refetch();
    } catch (error) {
      console.error("Error restoring products:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#2F3437] font-sans selection:bg-black/10 relative overflow-x-hidden">
      {/* Subtle ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(#111111 0.5px, transparent 0.5px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(251,243,219,0.5),_transparent_60%)]" />
      </div>

      {/* Header */}
      <ArchiveOSHeader />

      <main className="max-w-[1400px] mx-auto p-6 space-y-8">
        {/* Bento Grid Stats */}
        <ArchiveOSStats
          totalDocs={totalDocs}
          totalValue={totalValue}
          totalStock={totalStock}
        />

        {/* Filter Bar */}
        <ArchiveOSFilterBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onDeleteMultiple={handleHardDeleteMultiple}
          selectedCount={selectedIds.length}
        />

        {/* Archive Table */}
        <ArchiveOSTable
          products={products}
          selectedIds={selectedIds}
          isLoading={isLoading}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onRestore={handleRestore}
          onHardDelete={handleHardDelete}
        />

        {/* Pagination */}
        <ArchiveOSPagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>

      {/* Floating Action Bar */}
      <ArchiveOSFloatingBar
        selectedIds={selectedIds}
        onRestoreMultiple={handleRestoreMultiple}
        onHardDeleteMultiple={handleHardDeleteMultiple}
        onClearSelection={() => setSelectedIds([])}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
      />
    </div>
  );
};

export default ArchiveOS;
