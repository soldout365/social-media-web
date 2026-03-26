import { useState } from "react";
import { motion } from "framer-motion";
import {
  useGetProducts,
  useAddProduct,
  useUpdateProduct,
  useUpdateProductStatus,
  useSoftDeleteProduct,
  useDeleteProduct,
  useDeleteMultipleProducts,
} from "../../../hooks/useProduct";
import type {
  TProduct,
  TProductForm,
  TProductFormEdit,
} from "../../../types/product.type";
import ConfirmModal from "../../../components/common/ConfirmModal";

// Components
import ProductPageHeader from "./components/ProductPageHeader";
import ProductPageFilter from "./components/ProductPageFilter";
import ProductPageTable from "./components/ProductPageTable";
import ProductPagePagination from "./components/ProductPagePagination";
import ProductPageFloatingBar from "./components/ProductPageFloatingBar";
import ProductPageDrawer from "./components/ProductPageDrawer";

const ProductPage: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
  const [activeTab, setActiveTab] = useState<"current" | "archive">("current");

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Form state
  const [formData, setFormData] = useState<Partial<TProductForm>>({});
  const [editingProduct, setEditingProduct] = useState<TProduct | null>(null);

  // API calls - get products based on active tab
  const {
    data: productsData,
    isLoading,
    refetch,
  } = useGetProducts({
    _limit: limit,
    _page: page,
    q: searchQuery || undefined,
    ...(statusFilter && { status: statusFilter }),
    deleted: activeTab === "archive" ? "true" : "false",
  });

  const addProductMutation = useAddProduct();
  const updateProductMutation = useUpdateProduct();
  const updateStatusMutation = useUpdateProductStatus();
  const softDeleteMutation = useSoftDeleteProduct();
  const deleteProductMutation = useDeleteProduct();
  const deleteMultipleMutation = useDeleteMultipleProducts();

  const products: TProduct[] = productsData?.docs || [];

  // Calculate total pages
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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleTabChange = (tab: "current" | "archive") => {
    setActiveTab(tab);
    setPage(1);
    setStatusFilter("");
  };

  const handleAddProduct = async () => {
    if (
      !formData.nameProduct ||
      !formData.price ||
      !formData.category ||
      !formData.brand
    ) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    try {
      await addProductMutation.mutateAsync(formData as TProductForm);
      setIsDrawerOpen(false);
      setFormData({});
      refetch();
    } catch {
      // Error handled in mutation hook
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct || !formData.nameProduct || !formData.price) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }
    try {
      await updateProductMutation.mutateAsync({
        _id: editingProduct._id,
        nameProduct: formData.nameProduct || "",
        price: formData.price || 0,
        category: formData.category || "",
        brand: formData.brand || "",
        status: (formData.status as "active" | "inactive") || "active",
        desc: formData.desc || "",
        sale: formData.sale || 0,
        sizes: [],
        images: [],
      } as TProductFormEdit);
      setIsDrawerOpen(false);
      setEditingProduct(null);
      setFormData({});
      refetch();
    } catch {
      // Error handled in mutation hook
    }
  };

  const handleUpdateStatus = async (productId: string) => {
    try {
      await updateStatusMutation.mutateAsync(productId);
      refetch();
    } catch {
      // Error handled in useUpdateProductStatus hook
    }
  };

  const handleSoftDelete = async (productId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Xóa sản phẩm",
      description: "Bạn có chắc chắn muốn xóa sản phẩm này vào thùng rác?",
      onConfirm: async () => {
        try {
          await softDeleteMutation.mutateAsync(productId);
          refetch();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } catch {
          // Error handled in useSoftDeleteProduct hook
        }
      },
    });
  };

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
        } catch {
          // Error handled in useSoftDeleteProduct hook
        }
      },
    });
  };

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
        } catch {
          // Error handled in useDeleteProduct hook
        }
      },
    });
  };

  const handleSoftDeleteMultiple = async () => {
    setConfirmModal({
      isOpen: true,
      title: "Xóa sản phẩm",
      description: `Bạn có chắc chắn muốn xóa ${selectedIds.length} sản phẩm vào thùng rác?`,
      onConfirm: async () => {
        try {
          await deleteMultipleMutation.mutateAsync(selectedIds);
          setSelectedIds([]);
          refetch();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } catch {
          // Error handled in useDeleteMultipleProducts hook
        }
      },
    });
  };

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
        } catch {
          // Error handled in useDeleteMultipleProducts hook
        }
      },
    });
  };

  const handleRestoreMultiple = async () => {
    try {
      for (const id of selectedIds) {
        await softDeleteMutation.mutateAsync(id);
      }
      setSelectedIds([]);
      refetch();
    } catch {
      // Error handled in useSoftDeleteProduct hook
    }
  };

  const openAddDrawer = () => {
    setEditingProduct(null);
    setFormData({});
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (product: TProduct) => {
    setEditingProduct(product);
    setFormData({
      nameProduct: product.nameProduct,
      price: product.price,
      category:
        typeof product.category === "object"
          ? product.category._id
          : product.category,
      brand:
        typeof product.brand === "object" ? product.brand._id : product.brand,
      status: product.status,
      desc: product.desc,
      sale: product.sale || 0,
    });
    setIsDrawerOpen(true);
  };

  const handleFormChange = (data: Partial<TProductForm>) => {
    setFormData(data);
  };

  const handleSubmit = () => {
    if (editingProduct) {
      handleUpdateProduct();
    } else {
      handleAddProduct();
    }
  };

  return (
    <div className="bg-[#F7F6F3] text-[#2F3437] min-h-screen font-sans selection:bg-[#1F6C9F]/10">
      {/* Subtle ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(251,243,219,0.4),_transparent_60%)]" />
      </div>

      <main className="flex-1 px-6 py-12 max-w-[1400px] mx-auto w-full">
        {/* Page Header */}
        <ProductPageHeader
          searchQuery={searchQuery}
          onSearchChange={handleSearch}
          onAddClick={openAddDrawer}
        />

        {/* Bento Grid Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-[#EAEAEA] bg-[#FBFBFA] p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
        >
          <div className="rounded-[1.5rem] border border-[#EAEAEA] bg-white min-h-[500px] flex flex-col overflow-hidden">
            {/* Filter Header */}
            <ProductPageFilter
              activeTab={activeTab}
              statusFilter={statusFilter}
              onTabChange={handleTabChange}
              onStatusFilterChange={handleStatusFilter}
            />

            {/* Table */}
            <ProductPageTable
              products={products}
              selectedIds={selectedIds}
              isLoading={isLoading}
              activeTab={activeTab}
              onToggleSelect={toggleSelect}
              onToggleSelectAll={toggleSelectAll}
              onEdit={openEditDrawer}
              onSoftDelete={handleSoftDelete}
              onRestore={handleRestore}
              onHardDelete={handleHardDelete}
              onUpdateStatus={handleUpdateStatus}
            />

            {/* Pagination */}
            <ProductPagePagination
              page={page}
              totalPages={totalPages}
              totalDocs={totalDocs}
              limit={limit}
              onPageChange={setPage}
            />
          </div>
        </motion.div>
      </main>

      {/* Floating Action Bar */}
      <ProductPageFloatingBar
        selectedIds={selectedIds}
        activeTab={activeTab}
        onSoftDeleteMultiple={handleSoftDeleteMultiple}
        onRestoreMultiple={handleRestoreMultiple}
        onHardDeleteMultiple={handleHardDeleteMultiple}
        onClearSelection={() => setSelectedIds([])}
      />

      {/* Product Detail Drawer */}
      <ProductPageDrawer
        isOpen={isDrawerOpen}
        editingProduct={editingProduct}
        formData={formData}
        onClose={() => setIsDrawerOpen(false)}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #EAEAEA; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ProductPage;
