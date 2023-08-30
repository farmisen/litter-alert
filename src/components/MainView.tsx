import React, { useState } from "react"
import Form, { FormInput } from "./Form"
import type { UseFormReset } from "react-hook-form"
import { Dialog } from "@headlessui/react"

const onSubmit =
  (setIsOpen: React.Dispatch<React.SetStateAction<boolean>>) =>
  (
    reset: UseFormReset<FormInput>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
  ) =>
  async ({ description, location, severity }: FormInput) => {
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

      const { error, message } = await response.json()

      if (error) {
        // eslint-disable-next-line no-console
        console.error("Error submitting form:", error)
        setErrorMessage(error)
        return
      }

      // eslint-disable-next-line no-console
      console.info("Submitted successfull:", message)

      // reset the form
      reset()

      // open the success dialog
      setIsOpen(true)
    } catch (e) {
      setErrorMessage(e.message)
      console.error(e.message)
    }
  }

const MainView = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Form onSubmit={onSubmit(setIsOpen)} />
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
            <div>
              <div className="mt-3 text-center sm:mt-5">
                <Dialog.Title
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900">
                  Submission successful
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Thank you for being a champion for our environment! 🌎 Your report
                    has been successfully submitted. Together, with every report, we are
                    a step closer to a cleaner, greener community. Keep up the fantastic
                    work and let&apos;s continue making a difference!
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={() => setIsOpen(false)}>
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default MainView
