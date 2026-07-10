export default function SellPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">List an Item</h1>

      <form className="space-y-6">
        <div>
          <label className="block text-sm mb-2">Title</label>
          <input 
            type="text" 
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-3" 
            placeholder="What are you selling?"
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Description</label>
          <textarea 
            className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 h-32" 
            placeholder="Be honest. People will see right through bullshit."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">Price</label>
            <input type="number" className="w-full bg-zinc-900 border border-zinc-700 rounded p-3" />
          </div>
          <div>
            <label className="block text-sm mb-2">Condition</label>
            <select className="w-full bg-zinc-900 border border-zinc-700 rounded p-3">
              <option>New</option>
              <option>Like New</option>
              <option>Used</option>
              <option>For Parts</option>
            </select>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-bold text-lg"
        >
          LIST THIS SHIT — $0.20
        </button>
      </form>
    </div>
  );
}
