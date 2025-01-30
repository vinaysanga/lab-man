<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageServerData } from "./$types";

  let { form, data }: { form: any; data: PageServerData } = $props();

  let { blockedSlots } = data;
</script>

<svelte:head>
  <title>Lab Man • New Booking</title>
</svelte:head>

<header class="pb-10 h-[1/7]">
  <h2 class="text-2xl md:text-4xl">New Booking</h2>
</header>
<section class="flex flex-col w-full h-5/6 items-center pt-20 gap-10">
  <form
    class="card p-10 border border-neutral/10 rounded-box flex flex-col gap-8 bg-base-200"
    method="post"
    use:enhance
  >
    <div class="flex flex-col gap-8">
      <div class="form-control w-full">
        <label for="bookingDate">
          Booking Date
          <span class="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="bookingDate"
          name="bookingDate"
          class="input"
          required
          min={new Date().getHours() >= 20
            ? new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]
            : new Date(Date.now() + 86400000).toISOString().split("T")[0]}
        />
      </div>
      <div class="form-control w-full">
        <label for="timeSlot">
          Time Slot
          <span class="text-red-500">*</span>
        </label>
        <select
          id="timeSlot"
          name="timeSlot"
          class="select"
          oninvalid={(e: Event) =>
            (e.target as HTMLInputElement).setCustomValidity(
              "Please select a time slot"
            )}
          oninput={(e: Event) =>
            (e.target as HTMLInputElement).setCustomValidity("")}
          required
        >
          <option value="" disabled selected hidden>Select a time slot</option>
          {#each Array.from(Array(5).keys()) as i}
            <option
              value={`${(i * 2 + 8).toString().padStart(2, "0")}:${(30).toString().padStart(2, "0")}-${(i * 2 + 10).toString().padStart(2, "0")}:${(30).toString().padStart(2, "0")}`}
              >{(i * 2 + 8).toString().padStart(2, "0")}:{(30)
                .toString()
                .padStart(2, "0")} - {(i * 2 + 10)
                .toString()
                .padStart(2, "0")}:{(30).toString().padStart(2, "0")}</option
            >
          {/each}
        </select>
      </div>
    </div>
    <div class="form-control">
      <label class="label cursor-pointer">
        <input
          type="checkbox"
          class="checkbox"
          name="tnc"
          required
          oninvalid={(e: Event) =>
            (e.target as HTMLInputElement).setCustomValidity(
              "Please agree to the Terms and Conditions"
            )}
          oninput={(e: Event) =>
            (e.target as HTMLInputElement).setCustomValidity("")}
        />
        <span class="label-text"
          >I agree to the <button
            type="button"
            class="link link-primary"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="scroll-inside-modal"
            data-overlay="#scroll-inside-modal">Terms and Conditions</button
          ></span
        >
      </label>
    </div>
    <div
      id="scroll-inside-modal"
      class="overlay modal overlay-open:opacity-100 hidden"
      role="dialog"
      tabindex="-1"
    >
      <div class="modal-dialog overlay-open:opacity-100 max-w-4xl">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Terms and Conditions</h3>
            <button
              type="button"
              class="btn btn-text btn-circle btn-sm absolute end-3 top-3"
              aria-label="Close"
              data-overlay="#scroll-inside-modal"
            >
              <span class="icon-[tabler--x] size-4"></span>
            </button>
          </div>
          <div class="modal-body">
            <div class="space-y-8">
              <div>
                <h4 class="text-xl font-semibold mb-3">Registration</h4>
                <ul class="ml-4 space-y-2">
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span>You cannot register manually</span>
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >You will get the username and passwords from Prof. Henry
                      Muccini</span
                    >
                  </li>
                </ul>
              </div>

              <div>
                <h4 class="text-xl font-semibold mb-3">Information for all</h4>
                <ul class="ml-4 space-y-2">
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >The system uses a priority mechanism to allocate the
                      booked slots. Since the room capacity is 20, the 20
                      highest priority students will get access to the room</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >Each time you get a slot confirmed, you will decrease
                      your priority by 1 point</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span>The slots are always 2 hours per slot</span>
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >You book the available slots via the App. However, it
                      does not guarantee access to the lab yet</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >Every day @ 20.00 CET, you will receive an e-mail saying
                      whether you are allowed to use the room the day after.
                      E.g. If you booked the slot for Tuesday, you would receive
                      the confirmation on Monday evening @ 20.00 CET</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >The more slots you book, the lower your priority gets. Do
                      not book unwanted slots: they will bring your priority
                      down</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >The system will randomly assign one main Captain, and a
                      backup Captain</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >Everybody will know who the captain and backup captain in
                      the confirmation e-mail</span
                    >
                  </li>
                </ul>
              </div>

              <div>
                <h4 class="text-xl font-semibold mb-3">
                  Rules (common for all)
                </h4>
                <p class="mb-3 text-red-700">
                  To use the lab, everyone must adhere to the following rules.
                  Any exception will lead to suspension of usage rights.
                </p>
                <ul class="ml-4 space-y-2">
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span>You must book the slot 1 day in advance</span>
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >Booking is mandatory and is individual. E.g. If Alex,
                      Bella, Chris and Dave want to use the room together as a
                      group, they all must book the slot</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >You can check-in until 20 minutes after your time starts.
                      You will not be allowed after 20 minutes</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >If you cannot attend at a reserved slot, cancel your
                      reservation before 8:00 pm the day before your reservation</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >If you are counted as a no-show (i.e. you do not check
                      in), you will move down in the priority queue</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >You must always check out at your end time. We suggest
                      packing up 10 minutes in advance to avoid overstaying. If
                      you overstay, you will move down in the priority queue</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >If you have two consecutive bookings, you must get
                      checked-in again to use the room. E.g. if you have
                      bookings from 9.30 to 11.30 and then 11.30 to 13.30, you
                      must check out at 11.30 and then check-in again</span
                    >
                  </li>
                </ul>
              </div>

              <div>
                <h4 class="text-xl font-semibold mb-3">Captains</h4>
                <ul class="ml-4 space-y-2">
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >Show the confirmation mail to the admins to get the key
                      to the lab</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >You must check-in all the people by scanning in the
                      QR-codes</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >You must not allow anyone except those checked-in to use
                      the lab</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >If there is another reservation after your slot ends, you
                      will also receive the names of the next Captains. You must
                      hand in the key to him/her</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >If there is no reservation, you must return the keys to
                      the admins</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >If anyone tries to disobey the rules, you must
                      immediately bring this to Prof. Henry Muccini's notice.
                      The sooner, the better</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >If you fail to follow the rules, you will move down in
                      the priority queue</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="mr-2">•</span>
                    <span
                      >The system will also assign one backup Captain that will
                      act as the Captain in case he or she is missing</span
                    >
                  </li>
                </ul>
              </div>

              <div class="p-4 rounded-lg">
                <p class="font-semibold">
                  Note: Any communication from Prof. Henry Muccini must be
                  followed and has priority over the above details.
                </p>
              </div>
            </div>
          </div>
          <div class="modal-footer mt-6">
            <button
              type="button"
              class="btn btn-primary"
              data-overlay="#scroll-inside-modal">Close</button
            >
          </div>
        </div>
      </div>
    </div>
    <button type="submit" class="btn btn-primary">Create Booking</button>
  </form>
  <div class="text-lg p-4 flex w-full items-center justify-center">
    <p class="text-red-500 text-2xl">{form?.error ?? ""}</p>
    <p class="text-green-500 text-2xl">{form?.success ?? ""}</p>
  </div>
</section>

