"use client";

import {
  ChartBarIcon,
  TruckIcon,
  UserGroupIcon,
  ChatBubbleLeftIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const stats = [
  { name: "Toplam Teklif", stat: "71", icon: DocumentTextIcon, change: "+12%", changeType: "increase" },
  { name: "Aktif Taşımalar", stat: "23", icon: TruckIcon, change: "+5%", changeType: "increase" },
  { name: "Yeni Müşteriler", stat: "42", icon: UserGroupIcon, change: "+18%", changeType: "increase" },
  { name: "Yeni Mesajlar", stat: "15", icon: ChatBubbleLeftIcon, change: "+7%", changeType: "increase" },
];

const recentActivities = [
  {
    id: 1,
    title: "Yeni Teklif",
    description: "İstanbul - Ankara taşıma teklifi alındı",
    date: "5 dakika önce",
    type: "teklif",
  },
  {
    id: 2,
    title: "Taşıma Tamamlandı",
    description: "İzmir - Antalya taşıması başarıyla tamamlandı",
    date: "1 saat önce",
    type: "tasima",
  },
  {
    id: 3,
    title: "Yeni Mesaj",
    description: "Müşteri geri bildirimi alındı",
    date: "2 saat önce",
    type: "mesaj",
  },
];

export default function DashboardPage() {
  return (
    <div>
      {/* İstatistikler */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-gray-800 px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-400">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-white">{item.stat}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  item.changeType === "increase" ? "text-green-400" : "text-red-400"
                }`}
              >
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Grafikler */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Aylık İstatistikler */}
        <div className="rounded-lg bg-gray-800 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Aylık İstatistikler</h2>
            <ChartBarIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="mt-6 h-[200px] flex items-center justify-center text-gray-400">
            Grafik buraya gelecek
          </div>
        </div>

        {/* Son Aktiviteler */}
        <div className="rounded-lg bg-gray-800 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Son Aktiviteler</h2>
          </div>
          <div className="mt-6">
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span
                          className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-700"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span
                            className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-gray-800 ${
                              activity.type === "teklif"
                                ? "bg-blue-500"
                                : activity.type === "tasima"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            {activity.type === "teklif" ? (
                              <DocumentTextIcon className="h-5 w-5 text-white" />
                            ) : activity.type === "tasima" ? (
                              <TruckIcon className="h-5 w-5 text-white" />
                            ) : (
                              <ChatBubbleLeftIcon className="h-5 w-5 text-white" />
                            )}
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4">
                          <div>
                            <p className="text-sm text-white">{activity.title}</p>
                            <p className="text-sm text-gray-400">{activity.description}</p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-400">
                            {activity.date}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 