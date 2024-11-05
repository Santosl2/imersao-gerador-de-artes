import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, HomeIcon, MapPinIcon } from "lucide-react";

export function GenerateWallpaper() {
  const [formData, setFormData] = useState({
    address: "",
    addressNumber: "",
    dateTime: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-sky-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-800">
          Beautiful Blue Two-Column Form
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Column */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-blue-700">
                Input Your Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-700"
                  >
                    Address
                  </Label>
                  <div className="relative">
                    <HomeIcon
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="Enter your address"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="addressNumber"
                    className="text-sm font-medium text-gray-700"
                  >
                    Address Number
                  </Label>
                  <div className="relative">
                    <MapPinIcon
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="addressNumber"
                      name="addressNumber"
                      value={formData.addressNumber}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="Enter address number"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="dateTime"
                    className="text-sm font-medium text-gray-700"
                  >
                    Date and Time
                  </Label>
                  <div className="relative">
                    <CalendarIcon
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      id="dateTime"
                      name="dateTime"
                      type="datetime-local"
                      value={formData.dateTime}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview Column */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-blue-700">
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                fdsfs
              </div>
              {submitted && (
                <div className="mt-4 p-6 bg-white rounded-lg shadow-inner">
                  <h3 className="text-xl font-semibold mb-4 text-blue-700">
                    Submitted Data:
                  </h3>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <HomeIcon className="mr-2 text-blue-600" size={18} />
                      <span className="font-medium">Address:</span>
                      <span className="ml-2">{formData.address}</span>
                    </p>
                    <p className="flex items-center">
                      <MapPinIcon className="mr-2 text-blue-600" size={18} />
                      <span className="font-medium">Address Number:</span>
                      <span className="ml-2">{formData.addressNumber}</span>
                    </p>
                    <p className="flex items-center">
                      <CalendarIcon className="mr-2 text-blue-600" size={18} />
                      <span className="font-medium">Date and Time:</span>
                      <span className="ml-2">{formData.dateTime}</span>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
