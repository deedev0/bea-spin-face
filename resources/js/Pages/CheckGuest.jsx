import { router, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function CheckGuest({ guest }) {

  const { data, setData, patch, processing } = useForm({
    is_guest: guest.is_guest ?? false,
    is_winner: guest.is_winner ?? false,
  });

  const toggleGuest = () => {
    const newValue = !data.is_guest;
    setData('is_guest', newValue);
    router.patch(`/guest/${guest.id}`, {
      is_guest: newValue,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setData('is_guest', !data.is_guest)
      },
      onError: () => setData('is_guest', !newValue),
    })
  }

  const toggleWinner = () => {
    const newValue = !data.is_winner;
    setData('is_winner', newValue);
    router.patch(`/guest/${guest.id}`, {
      is_winner: newValue,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setData('is_winner', !data.is_winner)
      },
      onError: () => setData('is_winner', !newValue),
    })
  }
  
  return (
    <>
      <td><input className="form-check-input" type="checkbox" checked={data.is_winner} id={`is_winner-${guest.id}`} disabled={processing} onChange={toggleWinner} /></td>
      <td><input className="form-check-input" type="checkbox" checked={data.is_guest} id={`is_guest-${guest.id}`} disabled={processing} onChange={toggleGuest} /></td>
    </>
  )
} 