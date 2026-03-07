"use client";
import { useState } from "react";
import TicketRow from "./TicketRow";
import TicketDetailsModal from "./TicketDetailsModal";
import { ChevronDown } from "lucide-react";
import { useUpdatePaidService } from "../../hooks/useService";

const TicketTable = ({ services = [], loading, error }) => {
  const [selectedService, setSelectedService] = useState(null);
  const updateMutation = useUpdatePaidService();

  const handleUpdate = ({ id, payload }) => {
    updateMutation.mutate({ id, payload });
    setSelectedService(null);
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-custom-blue font-poppins">
        Loading services...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-poppins">
        Failed to load services
      </div>
    );
  }

  return (
    <>
      {/* SECTION */}
      <section className="w-full lg:w-10/12 mx-auto mt-8 md:mt-12 px-4 lg:px-0">
        <h2 className="text-custom-blue font-poppins font-semibold text-base md:text-lg">
          Total Ticket Raised
        </h2>

        <div className="h-[2.5px] bg-custom-blue mt-2 mb-4 md:mb-6" />

        {/* TABLE CONTAINER */}
        <div
          className="
            relative bg-white rounded-2xl
            shadow-[0_10px_25px_rgba(0,0,0,0.2)]
            max-h-[420px] md:max-h-[520px]
            overflow-y-auto pb-16
          "
        >
          {/* EMPTY STATE */}
          {services.length === 0 && (
            <p className="text-center py-10 text-gray-500 font-poppins">
              No tickets found
            </p>
          )}

          {/* ROWS */}
          <div className="flex flex-col divide-y">
            {services.map((service) => (
              <TicketRow
                key={service._id}
                client={service.customer?.name}
                date={new Date(service.createdAt).toLocaleDateString()}
                ticketNo={service.serviceNo}
                status={
                  service.serviceStatus === "Completed"
                    ? "Availed"
                    : "Not Availed"
                }
                onView={() => setSelectedService(service)}
              />
            ))}
          </div>

          {/* BOTTOM SCROLL INDICATOR */}
          <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 pointer-events-none">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow
                            flex items-center justify-center">
              <ChevronDown className="text-custom-blue w-6 h-6 md:w-7 md:h-7" />
            </div>
          </div>
        </div>
      </section>

      {/* MODAL */}
      <TicketDetailsModal
        open={!!selectedService}
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onUpdate={handleUpdate}
      />
    </>
  );
};

export default TicketTable;
