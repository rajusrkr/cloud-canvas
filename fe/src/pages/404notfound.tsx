import { Card, CardBody, CardFooter } from "@heroui/react";
import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="h-screen w-screen">
      <img
        src="https://cdn.pixabay.com/photo/2019/03/03/09/34/monkey-4031425_1280.jpg"
        alt="bg-image"
        className="object-cover w-full h-full"
      />

      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 -z-10 bg-black/20"></div>
        <div className="flex justify-center">
          <Card className="w-64 mt-2.5 opacity-80" radius="sm">
            <CardBody>
              <h1 className="text-primary font-semibold text-2xl">
                404 page not found
              </h1>
              <p className="text-warning font-semibold">
                Seems like you are lost
              </p>
            </CardBody>
            <CardFooter>
              Go back to
              <span className="ml-1 text-primary hover:underline">
                <Link to={"/"}> home</Link>
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
