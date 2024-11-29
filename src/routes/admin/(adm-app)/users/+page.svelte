<script lang="ts">
  import { enhance } from "$app/forms";
  import * as XLSX from "xlsx";
  import UsersTable from "../../../../components/users-table.svelte";
  import type { PageServerData } from "./$types";

  let { data, form }: { data: PageServerData; form: any } = $props();
  let { students } = $state(data);

  let isProcessing = $state(false);

  let files: FileList | undefined = $state();
  $effect(() => {
    if (files) {
      isProcessing = true;
      for (const file of files) {
        readExcelFile(file).then((data) => {
          fetch("/api/upload-excel", {
            method: "POST",
            body: JSON.stringify({ data }),
          })
            .then()
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              isProcessing = false;
            });
        });
        window.location.reload();
      }
    }
  });

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });

          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };
</script>

<svelte:head>
  <title>Lab Man • Admin</title>
</svelte:head>

<header class="pb-10 h-[1/7]">
  <h2 class="text-2xl md:text-4xl">
    Total Users: {students.length}
  </h2>
</header>

<section class="flex flex-col h-[6/7] gap-5">
  <div class="flex gap-5">
    <button
      type="button"
      class="btn btn-primary w-44"
      aria-haspopup="dialog"
      aria-expanded="false"
      aria-controls="middle-center-modal"
      data-overlay="#middle-center-modal">Add User</button
    >
    <label for="file-upload" class="btn btn-outline gap-2 disabled">
      {#if isProcessing}
        <div class="flex items-center">
          <span>Processing </span>
          <span class="loading loading-ring loading-sm"></span>
        </div>
      {:else}
        <span>Upload an Excel File</span>
      {/if}
      <input
        accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        bind:files
        id="file-upload"
        name="file-upload"
        type="file"
        class="hidden"
        disabled={isProcessing}
      />
    </label>
  </div>

  <div
    id="middle-center-modal"
    class="overlay modal overlay-open:opacity-100 modal-middle hidden"
    role="dialog"
    tabindex="-1"
  >
    <div class="modal-dialog overlay-open:opacity-100">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Student details</h3>
        </div>
        <form
          class="modal-body flex flex-col gap-8"
          style="padding-top: 1em; !important"
          method="post"
          use:enhance
        >
          <div class="flex flex-col gap-8">
            <div class="form-control w-full">
              <input
                type="text"
                placeholder="Matriculation Number"
                class="input input-floating peer"
                name="matriculationNumber"
                pattern="^[0-9]+$"
                required
              />
              <label for="matriculationNumber" class="input-floating-label">
                Matriculation Number
                <span class="text-red-500">*</span></label
              >
            </div>
            <div class="form-control w-full">
              <input
                type="text"
                placeholder="Matti"
                class="input input-floating peer"
                name="name"
                pattern="[A-Za-z]+$"
                required
              />
              <label for="name" class="input-floating-label">
                Name
                <span class="text-red-500">*</span></label
              >
            </div>
            <div class="form-control w-full">
              <input
                type="text"
                placeholder="Mäkelainen"
                class="input input-floating peer"
                name="surname"
                pattern="[A-Za-z]+$"
                required
              />
              <label for="surname" class="input-floating-label">
                Surname
                <span class="text-red-500">*</span></label
              >
            </div>
            <div class="form-control w-full">
              <input
                type="text"
                placeholder="20XX - 20XX"
                class="input input-floating peer"
                name="yearOfStudy"
                required
              />
              <label for="yearOfStudy" class="input-floating-label">
                Year of Study (From - To)
                <span class="text-red-500">*</span></label
              >
            </div>
            <div class="form-control w-full">
              <input
                type="text"
                placeholder="matti.mäkelainen@student.univaq.it"
                class="input input-floating peer"
                name="email"
                pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]$"
                required
              />
              <label for="email" class="input-floating-label">
                Email
                <span class="text-red-500">*</span></label
              >
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
        <p class="text-lg p-4 flex w-full items-center justify-center">
          {form?.message ?? ""}
        </p>
      </div>
    </div>
  </div>

  {#if students.length === 0}
    <p>You have no users. ¯\_(ツ)_/¯</p>
  {:else}
    <section class="flex flex-col max-h-1/2 overflow-auto">
      <div class="flex flex-col p-0.5 gap-5">
        <label class="input-group max-w-xs">
          <span class="input-group-text">
            <span class="icon-[tabler--search] size-6"></span>
          </span>
          <input
            type="search"
            class="input grow"
            placeholder="Search"
            oninput={(e: Event) => {
              const search = (e.target as HTMLInputElement).value;
              if (search) {
                students = data.students.filter((student) => {
                  return student.username
                    .toLowerCase()
                    .includes(search.toLowerCase());
                });
              } else {
                students = data.students;
              }
            }}
          />
        </label>
        <UsersTable
          tableHeaders={["Username", "Restricted", "Options"]}
          tableData={students}
        />
      </div>
    </section>
  {/if}
</section>
