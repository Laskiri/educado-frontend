




const ProfessionelErfaring = () => {

    return (
    <div className="relative border flex-row border-[#166276] p-4 rounded-b-lg gap-5 text-left bg-white z-50">
    <div className="grid grid-cols-2 gap-10"> 
      <p>Empresa</p>
      <p>Cargo</p>
    </div>
    <div className="relative flex gap-10">
      <input
      type="text" id="placeholderField21"
      className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
      placeholder="placeholderField"
      />

      <input
      type="text" id="placeholderField22"
      className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
      placeholder="placeholderField"
      />
    </div>
    <div className="grid grid-cols-2 gap-10"> 
      <p>Início</p>
      <p>Fim</p>
    </div>
    <div className="relative flex gap-10">
      <input
      type="text" id="placeholderField23"
      className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
      placeholder="placeholderField"
      />

      <input
      type="text" id="placeholderField24"
      className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
      placeholder="placeholderField"
      />
    </div>
    <div className="grid grid-cols-1"> 
      <p>Descrição de atividades</p>
    </div>
    <div className="relative flex">
      <input
      type="text" id="placeholderField25"
      className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
      placeholder="placeholderField"
      />

    </div>
    </div>
    );
    };
    
    export default ProfessionelErfaring