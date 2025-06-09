import { useEffect, useState } from "react";
import { productSizeService } from "../../http/ProductSizeService";
import type { IProductSize, IProductSizeId } from "../../types/IProductSize";
// esto solo es una componente para probar las tablas intermediarias con id compuestos
export const ProductSizeTest = () => {
  const [productSizes, setProductSizes] = useState<IProductSize[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductSizes = async () => {
      setLoading(true);
      const data = await productSizeService.getAll();
      setProductSizes(data);
      setLoading(false);
    };

    fetchProductSizes();
  }, []);

  const handleDelete = async (id: IProductSizeId) => {
    const success = await productSizeService.delete(id);
    if (success) {
      setProductSizes((prev) =>
        prev.filter(
          (ps) => !(ps.idSize === id.idSize && ps.idProduct === id.idProduct)
        )
      );
    }
  };

  const handleCreate = async () => {
    const newItem: Partial<IProductSize> = {
      idSize: 16,
      idProduct: 1,
    };
    const created = await productSizeService.create(newItem);
    if (created) {
      setProductSizes((prev) => [...prev, created]);
    }
  };

  return (
    <div>
      <h2>Product Sizes</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {productSizes.map((ps) => (
            <li key={`${ps.idSize}-${ps.idProduct}`}>
              Size: {ps.idSize}, Product: {ps.idProduct}
              <button
                onClick={() =>
                  handleDelete({ idSize: ps.idSize, idProduct: ps.idProduct })
                }
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleCreate}>Crear producto-size</button>
    </div>
  );
};

export default ProductSizeTest;
