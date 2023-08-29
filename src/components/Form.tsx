import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"

enum SeverityEnum {
  MINIMAL = "minimal",
  MODERATE = "moderate",
  CONSIDERABLE = "considerable",
  SEVERE = "severe",
  CRITICAL = "critical"
}

interface FormInput {
  description: string
  location: string
  severity: SeverityEnum
}

// entry.1338056908=https%3A%2F%2Feletiofe.com%2Fwp-content%2Fuploads%2F2023%2F04%2F360867-imgur-just-banned-porn.jpg&entry.868187068=some+description&entry.25578658=some+location&entry.407993447=considerable&dlut=1692641890543&fvv=1&partialResponse=%5Bnull%2Cnull%2C%22-5174751832248013256%22%5D&pageHistory=0&fbzx=-5174751832248013256
// entry.1338056908=https://eletiofe.com/wp-content/uploads/2023/04/360867-imgur-just-banned-porn.jpg&entry.868187068=some+description&entry.25578658=some+location&entry.407993447=considerable&dlut=1692641890543&fvv=1&partialResponse=[null,null,"-5174751832248013256"]&pageHistory=0&fbzx=-5174751832248013256

const Form = () => {
  const { register, handleSubmit } = useForm<FormInput>()
  const onSubmit: SubmitHandler<FormInput> = async ({
    description,
    location,
    severity
  }) => {
    try {
      // Get the current date in UTC
      const now = new Date()

      // Get the Unix timestamp in milliseconds
      const timestampMilliseconds = now.getTime()

      // Convert it to seconds
      const timestampSeconds = Math.floor(timestampMilliseconds / 1000)

      const formData = {
        timestamp: timestampSeconds,
        description,
        severity,
        location,
        media:
          "https://eletiofe.com/wp-content/uploads/2023/04/360867-imgur-just-banned-porn.jpg"
      }

      const response = await fetch("/formResponse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
        mode: "no-cors"
      })

      const response_body = await response.json()

      // eslint-disable-next-line no-console
      console.info("Submitted successfull:", response_body)
    } catch (e) {
      console.error(e.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Litter Alert
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Help us keep our community clean and green! Use this form to report
            instances of litter you come across. By providing essential details like
            photos, descriptions, locations, and severity, you empower our efforts to
            address and reduce litter effectively. Together, we can create a cleaner,
            more beautiful environment.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <textarea
                {...register("description")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="col-span-full">
              <label
                htmlFor="location"
                className="block text-sm font-medium leading-6 text-gray-900">
                Location
              </label>
              <textarea
                {...register("location")}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="severity"
                className="block text-sm font-medium leading-6 text-gray-900">
                Severity
              </label>
              <div className="mt-2">
                <select
                  {...register("severity")}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                  <option value="minimal">Minimal</option>
                  <option value="moderate">Moderate</option>
                  <option value="considerable">Considerable</option>
                  <option value="severe">Severe</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}

export default Form
