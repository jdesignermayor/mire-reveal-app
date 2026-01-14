// import { supabaseBrowser } from "@/lib/supabase/client";
// import { useMutation } from "@tanstack/react-query";

import { useMutation, useQuery } from "@tanstack/react-query";

// function generateRandomSimplePassword() {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let password = "";
//   for (let i = 0; i < 12; i++) {
//     password += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return password;
// }


export function getRegisteredUsers() {
  return useQuery({
    queryKey: ["registered-users"],
    queryFn: async () => {
      const res = await fetch("/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null)
        throw new Error(
          errorBody?.message || "Error al obtener los usuarios registrados"
        )
      }
      return res.json();
    },
  });
}

export function getCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await fetch("/api/company", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null)
        throw new Error(
          errorBody?.message || "Error al obtener las compañías"
        )
      }
      return res.json();
    },
  });
}

export function createCompanyMutation() {
  return useMutation({
    mutationFn: async (company: { name: string; email: string; phone: string; nit: string; billingPlan: string }) => {
      try {
        const res = await fetch("/api/company", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: company.name,
            email: company.email,
            phone: company.phone,
            nit: company.nit,
            billingPlan: company.billingPlan,
            credentials: "same-origin",
          }),
        });

        if (!res.ok) {
          const errorBody = await res.json().catch(() => null)
          throw new Error(
            errorBody?.error || "Error al crear la compañía"
          )
        }
        return res.json();
      } catch (error) {
        throw error;
      }
    },
  });
}

export function updateCompanyMutation() {
  return useMutation({
    mutationFn: async (company: { id: string; name: string; email: string; phone: string; nit: string; billingPlan: string }) => {
      try {
        const res = await fetch("/api/company", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: company.id,
            name: company.name,
            email: company.email,
            phone: company.phone,
            nit: company.nit,
            id_plan: company.billingPlan,
            credentials: "same-origin",
          }),
        });

        if (!res.ok) {
          const errorBody = await res.json().catch(() => null)
          throw new Error(
            errorBody?.error || "Error al actualizar la compañía"
          )
        }
        return res.json();
      } catch (error) {
        throw error;
      }
    },
  });
}

export function deleteCompanyMutation() {
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const res = await fetch("/api/company", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyId: id,
            credentials: "same-origin",
          }),
        });

        if (!res.ok) {
          const errorBody = await res.json().catch(() => null)
          throw new Error(
            errorBody?.error || "Error al eliminar la compañía"
          )
        }
        return res.json();
      } catch (error) {
        throw error;
      }
    },
  });
}


export function assignCompanyMutation() {
  return useMutation({
    mutationFn: async (data: { companyId: string; userId: string; email: string }) => {
      try {
        const res = await fetch("/api/company/assign", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyId: data.companyId,
            userId: data.userId,
            email: data.email,
            credentials: "same-origin",
          }),
        });

        if (!res.ok) {
          const errorBody = await res.json().catch(() => null)
          throw new Error(
            errorBody?.error || "Error al asignar usuario a la compañía"
          )
        }
        return res.json();
      } catch (error) {
        throw error;
      }
    },
  });
}

export function deleteUserMutation() {
  return useMutation({
    mutationFn: async (id: string) => {
        try {
            const res = await fetch("/api/user", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: id,
                    credentials: "same-origin",
                }),
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => null)
                throw new Error(
                    errorBody?.error || "Error al eliminar el usuario"
                )
            }
            return res.json();
        } catch (error) {
            throw error;
        }
    },
  });
}


export function createUserMutation() {
    return useMutation({
        mutationFn: async (user: { fullName: string; nit: string; email: string }) => {
            try {
                const res = await fetch("/api/user", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fullName: user.fullName,
                        nit: user.nit,
                        email: user.email,
                        credentials: "same-origin",
                    }),
                });

                if (!res.ok) {
                    const errorBody = await res.json().catch(() => null)

                    throw new Error(
                        errorBody?.error || "Error al crear el usuario"
                    )
                }
                return res.json();
            } catch (error) {
                throw error;
            }
        },
    });
}