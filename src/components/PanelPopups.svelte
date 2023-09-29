<script lang="ts">
  import IconArrowLeft from '~icons/heroicons/arrow-left'
  import PopupContainer from '/src/components/PopupContainer.svelte'
  import Spinner from '/src/components/Spinner.svelte'
  import InputText from '/src/components/form/input-text.svelte'
</script>

<PopupContainer key="newPerson" let:close>
  <div>
    <div class="p-4 flex items-center">
      <div class="flex-auto">ثبت اطلاعات خادم جدید</div>

      <button class="btn circle ghost gray" on:click={close}>
        <IconArrowLeft class="w-5 h-5" />
      </button>
    </div>

    <div class="flex flex-col gap-4 px-4">
      <InputText label="نام" />
      <InputText label="نام خانوادگی" />
      <InputText label="کد خدمتی" onlyNumber={true} />

      <div>
        <button type="button" class="btn indigo icon shrink-0">
          <span>ارسال اطلاعات</span>

          {#if false}
            <Spinner class="w-4 h-4 mx-auto" />
          {:else}
            <IconArrowLeft class="w-4 h-4" />
          {/if}
        </button>
      </div>
    </div>
  </div>
</PopupContainer>
