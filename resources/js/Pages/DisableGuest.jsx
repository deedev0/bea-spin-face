import { router, useForm } from '@inertiajs/react';

export default function DisableGuest({ guest }) {
  const { data, setData, patch, processing } = useForm({
    status: guest.status ?? true,
  });

  const toggleDisableGuest = () => {
    const newValue = !data.status;
    setData('status', newValue);
    router.patch(`/guest/${guest.id}`, {
      status: newValue,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setData('status', !data.status)
      },
      onError: () => setData('status', !newValue),
    })
  }

  return (
    <button
      onClick={toggleDisableGuest}
      disabled={processing}
      className={`btn text-light ${guest.status ? 'btn-info' : 'btn-secondary'}`}
    >
      {guest.status ? 'Aktif' : 'Disabled'}
    </button>
  )
}