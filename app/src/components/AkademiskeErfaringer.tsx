




const AkademiskeErfaringer = () => {

return (
<div className="relative border flex-row border-[#166276] p-4 rounded-b-lg gap-10 text-left bg-white z-50">
<div className="grid grid-cols-2 gap-10"> 
  <p>Formação</p>
  <p>Status</p>
</div>
<div className="relative flex gap-10">
  <input
  type="text" id="Træning"
  className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
  placeholder="placeholderField"
  />

  <input
  type="text" id="Status"
  className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
  placeholder="placeholderField"
  />
</div>
<div className="grid grid-cols-2 gap-10"> 
  <p>Curso</p>
  <p>Instituição</p>
</div>
<div className="relative flex gap-10">
  <input
  type="text" id="Kursus"
  className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
  placeholder="placeholderField"
  />

  <input
  type="text" id="Institution"
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
  type="text" id="start"
  className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
  placeholder="Mês / Ano"
  />

  <input
  type="text" id="Slut"
  className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-base focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
  placeholder="Mês / Ano"
  />
</div>
</div>
);
};

export default AkademiskeErfaringer