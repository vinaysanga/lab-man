<script lang="ts">
  import { enhance } from "$app/forms";
  import { Recurrence } from "$lib/enums/recurrence";
  import type { PageServerData } from "../block-dates/$types";
  let { data, form }: { data: PageServerData; form: any } = $props();
  const { allBlockedSlots } = data;

  let recurrence = $state(Recurrence.oneTime);

  const getMinDate = () =>
    new Date().getHours() >= 20
      ? new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0]
      : new Date(Date.now() + 86400000).toISOString().split("T")[0];

  let bookingDate: string = $state("");

  const timeSlots = Array.from(Array(5).keys()).map((i) => ({
    value: `${(i * 2 + 8).toString().padStart(2, "0")}:${(30).toString().padStart(2, "0")}-${(i * 2 + 10).toString().padStart(2, "0")}:${(30).toString().padStart(2, "0")}`,
    label: `${(i * 2 + 8).toString().padStart(2, "0")}:${(30).toString().padStart(2, "0")} - ${(i * 2 + 10).toString().padStart(2, "0")}:${(30).toString().padStart(2, "0")}`,
  }));
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
            <div class="form-control">
              <label for="recurrence" class="label">Recurrence</label>
              <div
                id="recurrence"
                class="flex gap-4"
                role="radiogroup"
                aria-label="Recurrence"
              >
                <label class="label cursor-pointer">
                  <input
                    type="radio"
                    name="recurrence"
                    value={Recurrence.oneTime}
                    class="radio radio-primary"
                    checked
                    bind:group={recurrence}
                  />
                  <span class="label-text ml-2">One Time</span>
                </label>
                <label class="label cursor-pointer">
                  <input
                    type="radio"
                    name="recurrence"
                    value={Recurrence.daily}
                    class="radio radio-primary"
                    bind:group={recurrence}
                  />
                  <span class="label-text ml-2">Daily</span>
                </label>
                <label class="label cursor-pointer">
                  <input
                    type="radio"
                    name="recurrence"
                    value={Recurrence.weekly}
                    class="radio radio-primary"
                    bind:group={recurrence}
                  />
                  <span class="label-text ml-2">Weekly</span>
                </label>
              </div>
            </div>

            <div class="form-control w-full">
              <label for="bookingDate">
                {#if recurrence === Recurrence.oneTime}
                  Date
                {:else}
                  Starting Date
                {/if}
                <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                class="input"
                required
                bind:value={bookingDate}
                min={getMinDate()}
              />
              {#if recurrence === Recurrence.weekly}
                <p class="text-sm text-base-content/70 mt-1">
                  This slot will be blocked for every week starting from this
                  date
                </p>
              {:else if recurrence === Recurrence.daily}
                <p class="text-sm text-base-content/70 mt-1">
                  This slot will be blocked for every day starting from this
                  date
                </p>
              {:else if recurrence === Recurrence.oneTime}
                <p class="text-sm text-base-content/70 mt-1">
                  This slot will be blocked on this date
                </p>
              {/if}
            </div>

            {#if recurrence !== Recurrence.oneTime}
              <div class="form-control w-full">
                <label for="endDate">
                  End Date
                  <span class="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  class="input"
                  required
                  min={bookingDate === "" ? getMinDate() : bookingDate}
                />
                <p class="text-sm text-base-content/70 mt-1">
                  Slots will be blocked until this date
                </p>
              </div>
            {/if}

            <div class="form-control w-full">
              <label for="timeSlot">
                Time Slots
                <span class="text-red-500">*</span>
              </label>
              <select
                multiple
                id="timeSlot"
                name="timeSlot"
                class="select"
                required
              >
                {#each timeSlots as slot}
                  <option value={slot.value}>{slot.label}</option>
                {/each}
              </select>
              <p class="text-sm text-base-content/70 mt-1">
                Hold Ctrl/Cmd to select multiple
              </p>
            </div>
          </div>

          <div class="flex items-center justify-center gap-5">
            <button
              type="button"
              class="btn btn-soft btn-secondary"
              data-overlay="#middle-center-modal"
              onclick={() => window.location.reload()}>Close</button
            >
            <button type="submit" class="btn btn-primary">Block</button>
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
              {#each ["Date", "Time Slot", "Recurrence", "Action"] as header}
                <th>{header}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each allBlockedSlots as row}
              <tr>
                <td class="text-nowrap">
                  {#if row.recurrence === Recurrence.oneTime}
                    {new Date(row.startDate).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  {:else}
                    {new Date(row.startDate).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                    {#if row.endDate}
                      to
                      {new Date(row.endDate).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    {/if}
                  {/if}
                </td>
                <td class="text-nowrap">
                  {row.startTime?.slice(0, 5) ?? "Full Day"}
                  {row.endTime ? `to ${row.endTime.slice(0, 5)}` : ""}
                </td>
                <td class="text-nowrap">
                  {row.recurrence === Recurrence.weekly
                    ? "Weekly"
                    : row.recurrence === Recurrence.daily
                      ? "Daily"
                      : "One Time"}
                </td>
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
