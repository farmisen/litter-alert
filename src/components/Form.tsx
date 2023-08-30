import React, { useCallback, useState } from "react"
import { useForm, SubmitHandler, UseFormReset } from "react-hook-form"
import { XCircleIcon } from "@heroicons/react/20/solid"
import { PhotoIcon } from "@heroicons/react/24/solid"
import Camera from "react-html5-camera-photo"
import "react-html5-camera-photo/build/css/index.css"
import ImagePreview from "./ImagePreview"

enum SeverityEnum {
  MINIMAL = "minimal",
  MODERATE = "moderate",
  CONSIDERABLE = "considerable",
  SEVERE = "severe",
  CRITICAL = "critical"
}

export interface FormInput {
  photoDataUri: string
  description: string
  location: string
  severity: SeverityEnum
}

const Form = ({
  onSubmit
}: {
  onSubmit: (
    reset: UseFormReset<FormInput>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
  ) => SubmitHandler<FormInput>
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPhotoView, setIsPhotoView] = useState<boolean>(false)
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null)
  const { register, handleSubmit, reset, setValue } = useForm<FormInput>()

  const handleTakePhoto = useCallback(
    (dataUri: string) => {
      setPhotoDataUri(dataUri)
      setValue("photoDataUri", dataUri)
      setIsPhotoView(false)
    },
    [setIsPhotoView]
  )

  return isPhotoView ? (
    <Camera
      onTakePhoto={(dataUri: string) => {
        handleTakePhoto(dataUri)
      }}
      idealFacingMode="environment"
    />
  ) : (
    <form onSubmit={handleSubmit(onSubmit(reset, setErrorMessage))}>
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

          <div className="col-span-full">
            <label
              htmlFor="photo"
              className="block text-sm font-medium leading-6 text-gray-900">
              Photo
            </label>
            <div className="mt-2 flex items-center gap-x-3">
              {photoDataUri ? (
                <ImagePreview dataUri={photoDataUri} />
              ) : (
                <PhotoIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
              )}

              <button
                type="button"
                className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => setIsPhotoView(true)}>
                Change
              </button>

              <input type="hidden" {...register("photoDataUri")} />
            </div>
          </div>

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

      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4 mt-5">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                There was an error with your submission:
              </h3>
              <div className="mt-2 text-sm text-red-700">{errorMessage}</div>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export default Form
