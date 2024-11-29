<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageServerData } from "../block-dates/$types";
  let { data, form }: { data: PageServerData; form: any } = $props();
  const { allBlockedSlots } = data;
</script>

<svelte:head>
  <title>Lab Man • Admin</title>
</svelte:head>

<header class="pb-5 h-[1/7]">
  <h2 class="text-2xl md:text-4xl">Block Dates</h2>
</header>

<section class="flex flex-col w-full h-[6/7] gap-5">
  <button
    type="button"
    class="btn btn-primary w-44"
    aria-haspopup="dialog"
    aria-expanded="false"
    aria-controls="middle-center-modal"
    data-overlay="#middle-center-modal">Add Blocked Slot</button
  >

  <div
    id="middle-center-modal"
    class="overlay modal overlay-open:opacity-100 modal-middle hidden"
    role="dialog"
    tabindex="-1"
  >
    <div class="modal-dialog overlay-open:opacity-100">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Add Blocked Slot</h3>
        </div>
        <form class="modal-body flex flex-col gap-8" method="post" use:enhance>
          <div class="flex flex-col gap-8">
            <div class="form-control w-full">
              <label for="bookingDate">
                Date
                <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="bookingDate"
                name="bookingDate"
                class="input"
                required
                min={new Date().getHours() >= 20
                  ? new Date(Date.now() + 2 * 86400000)
                      .toISOString()
                      .split("T")[0]
                  : new Date(Date.now() + 86400000).toISOString().split("T")[0]}
              />
            </div>
            <div class="form-control w-full">
              <label for="timeSlot">
                Time Slot
                <span class="text-red-500">*</span>
              </label>
              <select id="timeSlot" name="timeSlot" class="select" required>
                <option value="" disabled selected hidden
                  >Select a time slot</option
                >
                {#each Array.from(Array(5).keys()) as i}
                  <option
                    value={`${(i * 2 + 8).toString().padStart(2, "0")}:${(30).toString().padStart(2, "0")}-${(i * 2 + 10).toString().padStart(2, "0")}:${(30).toString().padStart(2, "0")}`}
                    >{(i * 2 + 8).toString().padStart(2, "0")}:{(30)
                      .toString()
                      .padStart(2, "0")} - {(i * 2 + 10)
                      .toString()
                      .padStart(2, "0")}:{(30)
                      .toString()
                      .padStart(2, "0")}</option
                  >
                {/each}
              </select>
            </div>
          </div>
          <div class="flex items-center justify-center gap-5">
            <button
              type="button"
              class="btn btn-soft btn-secondary"
              data-overlay="#middle-center-modal"
              onclick={() => window.location.reload()}>Close</button
            >
            <button type="submit" class="btn btn-primary">Save</button>
          </div>
        </form>
        <div class="text-lg p-4 flex w-full items-center justify-center">
          <p class="text-red-500 text-2xl">{form?.error ?? ""}</p>
          <p class="text-green-500 text-2xl">{form?.success ?? ""}</p>
        </div>
      </div>
    </div>
  </div>
  <section class="flex flex-col h-1/2">
    {#if allBlockedSlots.length === 0}
      <p>There are no blocked dates. ¯\_(ツ)_/¯</p>
    {:else}
      <div
        class="border-base-content/25 rounded-box w-full overflow-x-auto border"
      >
        <table class="table table-borderless">
          <thead>
            <tr>
              {#each ["Date", "Time Slot", "Action"] as header}
                <th>{header}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each allBlockedSlots as row}
              <tr>
                <td class="text-nowrap"
                  >{new Date(row.blockedDate).toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}</td
                >
                <td class="text-nowrap"
                  >{row.startTime.slice(0, 5)} to {row.endTime.slice(0, 5)}</td
                >
                <td class="text-nowrap">
                  <button
                    class="btn btn-circle btn-text btn-sm"
                    aria-label="Action button"
                    onclick={async (e) => {
                      e.preventDefault();
                      const res = await fetch("/api/blocked-slot/delete", {
                        method: "DELETE",
                        body: JSON.stringify({ id: row.id }),
                      });
                      await res.json();
                      window.location.reload();
                    }}><span class="icon-[tabler--trash]"></span></button
                  >
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>
</section>
