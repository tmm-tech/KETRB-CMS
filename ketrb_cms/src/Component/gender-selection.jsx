import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "../Component/radio-group"
import { Label } from "../Component/label"
import { Input } from "../Component/input"

const GenderSelection = ({ value, onChange }) => {
  const [showOtherInput, setShowOtherInput] = useState(value === "other")

  const handleGenderChange = (newValue) => {
    onChange(newValue)
    setShowOtherInput(newValue === "other")
  }

  const handleCustomGenderChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <div className="space-y-3">
      <Label className="text-gray-700">
        Gender <span className="text-red-500">*</span>
      </Label>
      <RadioGroup value={value} onValueChange={handleGenderChange} className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="male" id="gender-male" />
          <Label htmlFor="gender-male" className="font-normal">
            Male
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="female" id="gender-female" />
          <Label htmlFor="gender-female" className="font-normal">
            Female
          </Label>
        </div>
      </RadioGroup>

      {showOtherInput && (
        <div className="pl-6 mt-2">
          <Input
            type="text"
            placeholder="Please specify"
            className="max-w-xs"
            value={value !== "other" ? value : ""}
            onChange={handleCustomGenderChange}
          />
        </div>
      )}
    </div>
  )
}

export default GenderSelection