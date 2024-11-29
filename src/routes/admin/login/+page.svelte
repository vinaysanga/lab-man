<script lang="ts">
  import { enhance } from "$app/forms";
  import "../../../app.css";
  let { form }: { form: any } = $props();
</script>

<svelte:head>
  <title>Lab Man • Login</title>
</svelte:head>
<section
  class="w-screen h-screen flex flex-col gap-10 items-center justify-center"
>
  <form
    class="card p-10 md:p-15 border border-neutral/10 rounded-box flex flex-col gap-8"
    method="post"
    use:enhance
  >
    <h2 class="text-3xl md:text-4xl text-center">Lab Man</h2>
    <div class="flex flex-col gap-8">
      <div class="form-control w-full">
        <input
          id="username"
          type="text"
          placeholder="Enter username"
          class="input input-floating peer"
          name="username"
        />
        <label for="username" class="input-floating-label">Username</label>
      </div>
      <div class="form-control w-full">
        <input
          id="password"
          type="password"
          class="input input-floating peer"
          placeholder="Enter password"
          name="password"
        />
        <label for="password" class="input-floating-label">Password</label>
      </div>
    </div>
    <div class="w-full flex items-center justify-center gap-4">
      <button
        type="submit"
        name="login"
        class="btn btn-primary w-1/2"
        formaction="?/login"
      >
        Login
      </button>
    </div>
  </form>
  <p class="text-red-600 text-2xl">{form?.message ?? ""}</p>
</section>
