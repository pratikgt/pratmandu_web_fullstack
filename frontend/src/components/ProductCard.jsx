import { useCart } from "../context/CartContext.jsx";

function pickTitle(item) {
  return item?.name || item?.title || "Item";
}

function pickImage(item) {
  return item?.image || item?.img || item?.photo || "";
}

export default function ProductCard(props) {
  const { addToCart } = useCart();

  const item = props.item || null;
  if (!item) return null;

  const id = item._id || item.id;
  const title = pickTitle(item);
  const price = Number(item.price ?? 0);
  const rating = item.rating;
  const image = pickImage(item);

  const handleAdd = () => {
    if (!id) return;

    const payload = {
      ...item,
      _id: item._id || undefined,
      id: item._id ? undefined : id,
      name: item.name || title,
      title: undefined,
      price,
      image,
    };

    addToCart(payload);
    if (props.onAdd) props.onAdd(payload);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
            No Image
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          {typeof rating === "number" ? (
            <div className="whitespace-nowrap text-sm text-gray-600">
              ★ {rating.toFixed(1)}
            </div>
          ) : null}
        </div>

        {item.description ? (
          <p className="mt-1 text-sm text-gray-600">{item.description}</p>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-5">
          <span className="text-base font-bold">Rs. {Math.round(price)}</span>

          <button
            type="button"
            onClick={handleAdd}
            className="!min-w-[90px] !rounded-lg !bg-red-600 !px-4 !py-2 !text-sm !font-semibold !text-white transition hover:!bg-red-700 active:scale-[0.98]"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}