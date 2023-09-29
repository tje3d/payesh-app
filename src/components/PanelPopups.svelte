<script lang="ts">
  import PopupContainer from '/src/components/PopupContainer.svelte'
  import CreatePersonPopup from '/src/components/popup/CreatePersonPopup.svelte'
</script>

<PopupContainer key="newPerson" let:close>
  <CreatePersonPopup {close} />
</PopupContainer>
