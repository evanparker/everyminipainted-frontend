import FigureForm from "./figureForm";

const FigureEdit = () => {
  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Edit Figure
      </h1>
      <FigureForm mode="edit" />
    </>
  );
};

export default FigureEdit;
