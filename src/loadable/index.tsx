import React, {Suspense,lazy} from 'react';
export default (loaderCom:any)=>{
  const OtherComponent=lazy(loaderCom)
  return function MyComponent(props:any){
    return <Suspense fallback={1111}>
        <OtherComponent {...props}/>
    </Suspense>
  }
}
