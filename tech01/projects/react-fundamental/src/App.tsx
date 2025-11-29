import { useActionState, Suspense } from 'react'
// import { list } from './actions/post'
// import Posts from './components/posts';
import Products from './components/Products';
// import CreatePostForm from './components/CreatePostForm';

function App() {
  // const [name, setName] = useState("");
  // const [error, setError] = useState(null);
  // const [isPending, setIsPending] = useState(false);

  // const handleSubmit = async () => {
  //   setIsPending(true);
  //   const error= await updateName(name);
  //   setIsPending(false);
  //   if(error){
  //     setError(error);
  //   }
  // }

  const [error, submitAction, isPending] = useActionState(async (previousState, formData) => {
    // Add your form handling logic here
    return null;
  }, null)

  return (
    <div>
      <h1>Create Post</h1>
      <Products />
      {/* <CreatePostForm /> */}
      {/* <Suspense fallback={<div>Loading Posts...</div>}> */}
        {/* <Posts postsPromise={list()} /> */}
      {/* </Suspense> */}
    </div>
  )
  
}

export default App
