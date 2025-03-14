import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className='min-h-screen bg-gray-100'>
      <Header />
      <div className='pt-20 px-6'>{children}</div>
    </div>
  );
}
