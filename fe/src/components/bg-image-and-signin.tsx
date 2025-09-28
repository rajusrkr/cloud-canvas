import Signin from "./signin-form";

export default function BgImgAndSignin() {
  return (
    <div className="h-screen w-screen relative">
      {/* Background image */}
      <img
        src="https://pub-367a5b1b28f9415dae5b51f69d042dff.r2.dev/pexels-itfeelslikefilm-590478.jpg"
        alt="background-image"
        className="object-cover w-full h-full"
      />

      {/* Signin form */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/40 -z-10"></div>
        <Signin />
      </div>
    </div>
  );
}
