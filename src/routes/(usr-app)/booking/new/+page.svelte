<script lang="ts">
  import { enhance } from "$app/forms";
  let { form }: { form: any } = $props();
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
        <select id="timeSlot" name="timeSlot" class="select" required>
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
    <button type="submit" class="btn btn-primary">Create Booking</button>
  </form>
  <div class="text-lg p-4 flex w-full items-center justify-center">
    <p class="text-red-500 text-2xl">{form?.error ?? ""}</p>
    <p class="text-green-500 text-2xl">{form?.success ?? ""}</p>
  </div>
</section>
