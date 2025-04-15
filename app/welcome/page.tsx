"use client"

import Button from "@/components/(AdminPanel)/(Fields)/inputs/Button/Button";
import Textbox from "@/components/(AdminPanel)/(Fields)/inputs/TextBox/Textbox";


const Page1=()=>{

    return(<>
    <div className=" p-5 flex flex-col gap-5 border-2 m-auto ">
<h2 className="text-3xl font-bold">Welcome Back 👋</h2>
<p>Today is a new day. Its your day. You shape it. </p>
<p>Sign in to start managing your projects.</p>

<Textbox
       SetWidth="max-w-96 w-full"
       SetMargin="mb-6"
        name="alertemail"
        type="text"
        label="Email"
        onChange={()=>alert("")}
      />
         <Textbox
       SetWidth="max-w-96 w-full"
       SetMargin="mb-6"
        name="alertemail"
        type="text"
        label="Password"
        onChange={()=>alert("")}
      />

<a href="#" className="text-blue-700 flex justify-end   ">
    forgot Password? 
    </a>

<Button 
  onClick={() => alert('Button clicked!')} 
  width="max-w-96 w-full"
  >
    Sign In
</Button>

<p className="text-gray-400 mt-24 text-center">© 2024 ALL RIGHTS RESERVED</p>


    </div>

    </>)
}

export default Page1;