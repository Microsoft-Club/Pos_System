/*
 * MenuCard Component

 i.e item={ id,name,price,type}
    onAddToCart: function to handle adding item to cart
 */
export default function MenuCard({item,onAddToCart}) {
    return(
        <button

        onClick={()=>onAddToCart(item)}
        className="bg-white border border-slate-200 rounded-xl p-3 text-left hover:border-blue-400 hover:shadow-md transition">

            <h3 className="text-sm font-semibold text-slate-900 truncate">
                {item.name}
            </h3>
            <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] uppercase tracking-wide text-slate-400">
                    {item.type}
                </span>
                <span className="text-lg font-bold text-slate-600">
                    Rs.{Number(item.price).toFixed(2)}
                </span>
            </div>
        </button>
    )
}
