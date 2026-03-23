import MiniForm from "./miniForm";

const MiniEdit = () => {
  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Edit Mini
      </h1>
      <MiniForm mode="edit" />
    </>
  );
};

export default MiniEdit;
