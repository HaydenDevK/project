'use client';

import { useModalStore } from '@store/modal.store';
import DropdownMenu from '@ui/common/DropdownMenu';
import TripMemberModal from './tripMember/TripMemberModal';
import { twMerge } from 'tailwind-merge';
import { TTrip } from '@model/trip.model';
import { useGetTrip } from '@hooks/trip/useGetTrip';
import { useDeleteTrip } from '@hooks/trip/useDeleteTrip';
import { usePopupStore } from '@store/popup.store';
import { useRouter } from 'next/navigation';
import { TRIP_POPUP_MESSAGE } from '@constant/trip';
import Skeleton from '@ui/common/Skeleton';
import { calculateDDday } from '@util/\bcalculateDDay';
import toast from 'react-hot-toast';
import { usePatchTrip } from '@hooks/trip/usePatchTrip';
import TripModal from '@ui/Modal/TripModal';
import { useLogin } from '@hooks/auth/useLogin';

type TTripInfoProps = Pick<TTrip, 'id'>;

export default function TripInfo({ id }: TTripInfoProps) {
  const { data: userInfo } = useLogin();

  const { data: tripInfo, isLoading } = useGetTrip(id);
  const deleteTrip = useDeleteTrip();
  const editTrip = usePatchTrip();

  const { showModal } = useModalStore();
  const { showPopup } = usePopupStore();

  const router = useRouter();

  const dDay =
    tripInfo && tripInfo?.success
      ? calculateDDday(tripInfo.result.startDate)
      : 'D-0';

  const isOwner = userInfo?.user.id === tripInfo?.result?.owner.id;

  const handleCopyInviteLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success(TRIP_POPUP_MESSAGE.copyInviteLink, {
        iconTheme: { primary: '#28D7D2', secondary: '#ffffff' },
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to copy URL: ', err);
      toast.error(TRIP_POPUP_MESSAGE.copyInviteLinkError);
    }
  };

  const handleShowTripMember = () => {
    showModal({
      title: '멤버 관리',
      content: <TripMemberModal id={id} />,
    });
  };

  const handleEditTrip = () => {
    if (tripInfo?.success) {
      showModal({
        title: '여행 수정',
        content: (
          <TripModal
            id={tripInfo.result.id}
            name={tripInfo.result.name}
            startDate={tripInfo.result.startDate}
            endDate={tripInfo.result.endDate}
            onConfirm={(id, data) => editTrip.mutate({ id, data })}
            toggleSideBar={() => {}} // TODO build error
          />
        ),
      });
    }
  };

  const handleDeleteTrip = () => {
    showPopup({
      popupText: TRIP_POPUP_MESSAGE.deleteTrip,
      showCancelButton: true,
      confirmButtonText: '확인',
      onConfirm: () => {
        deleteTrip.mutate(id, {
          onSuccess: () => {
            router.push('/');
          },
        });
      },
    });
  };

  if (isLoading) {
    return (
      <section className="section-box min-h-[136px]">
        <div className="flex flex-col gap-3 py-4">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-8 w-32" />
        </div>
      </section>
    );
  }

  return (
    <section
      // TODO: 추후 배경이미지 추가될 경우 수정 필요
      style={
        {
          '--bg-img': `url('https://png.pngtree.com/thumb_back/fw800/background/20230902/pngtree-seoul-trip-with-tour-gsg-tour-korean-history-image_13115056.jpg')`,
        } as React.CSSProperties
      }
      className={twMerge(
        'section-box relative min-h-[136px] overflow-hidden bg-cover bg-center bg-no-repeat',
        // 'before:to--[#888888]/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-black before:opacity-50 before:content-[""]',
        // 'bg-[image:var(--bg-img)]',
        // backgroundImage && 'bg-[image:var(--bg-img)]',
      )}
    >
      <div className="relative z-10 flex flex-col gap-3 py-4">
        <h3 className="text-lg font-semibold leading-7">
          {tripInfo?.success ? tripInfo?.result.name : tripInfo?.message}
        </h3>
        <div className="text-[2rem] font-black leading-none">{dDay}</div>
      </div>
      <div className="absolute right-4 top-4">
        <DropdownMenu
          items={[
            { label: '공유하기', onClick: handleCopyInviteLink },
            { label: '멤버관리', onClick: handleShowTripMember },
            ...(isOwner
              ? [
                  { label: '수정하기', onClick: handleEditTrip },
                  { label: '삭제하기', onClick: handleDeleteTrip },
                ]
              : []),
          ]}
          className="bg-transparent font-black"
        >
          {/* 케밥 아이콘 부분 */} :
        </DropdownMenu>
      </div>
    </section>
  );
}
