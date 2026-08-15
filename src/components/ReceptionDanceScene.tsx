/** Transparent couple artwork shown beneath the Reception event. */
export function ReceptionDanceScene() {
  return (
    <figure className="-mx-2 flex justify-center">
      <img
        src={`${import.meta.env.BASE_URL}images/reception-twirl-couple.png`}
        alt="Groom gently twirling a bride dressed in pink"
        className="block h-auto w-[min(92vw,30rem)] drop-shadow-[0_18px_24px_rgba(106,52,69,0.18)]"
        loading="lazy"
        decoding="async"
      />
    </figure>
  );
}
