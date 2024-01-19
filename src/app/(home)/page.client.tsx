"use client";

import type {Salary} from "@/types";

import {HelpCircle} from "lucide-react";
import {useSearchParams, usePathname} from "next/navigation";
import {useRouter} from "next/navigation";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";

export default function HomePageClient({
  salaries,
  dollarPrice,
  filters,
}: {
  salaries: Salary[];
  dollarPrice: {old: number; actual: number};
  filters: {
    currency: {options: string[]; value: string};
    position: {options: string[]; value: string};
    seniority: {options: string[]; value: string};
    sort: keyof Salary;
    simulate: boolean;
    direction: "asc" | "desc";
  };
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function handleFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleSort(order: keyof Salary) {
    if (order === filters.sort) {
      handleFilter("direction", filters.direction === "asc" ? "desc" : "asc");
    } else {
      handleFilter("sort", order);
    }
  }

  return (
    <section className="grid gap-4">
      <nav className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <select
            className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            defaultValue={searchParams.get("position") ?? ""}
            onChange={(e) => handleFilter("position", e.target.value)}
          >
            <option value="">Todas las posiciones</option>
            {filters.position.options.map((position) => (
              <option key={position}>{position}</option>
            ))}
          </select>
          <select
            className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            defaultValue={searchParams.get("currency") ?? ""}
            onChange={(e) => handleFilter("currency", e.target.value)}
          >
            <option value="">Todas las monedas</option>
            {filters.currency.options.map((currency) => (
              <option key={currency}>{currency}</option>
            ))}
          </select>
          <select
            className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            defaultValue={searchParams.get("seniority") ?? ""}
            onChange={(e) => handleFilter("seniority", e.target.value)}
          >
            <option value="">Todos los seniorities</option>
            {filters.seniority.options.map((seniority) => (
              <option key={seniority}>{seniority}</option>
            ))}
          </select>
        </div>
        {dollarPrice.old !== dollarPrice.actual && (
          <Label className="flex items-center gap-2" htmlFor="simulate">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 opacity-50" />
                </TooltipTrigger>
                <TooltipContent className="max-w-64" side="left">
                  Simulamos los valores tomando el valor original cuando la gente subió su salario (
                  {dollarPrice.old.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                  ) y el valor actual (
                  {dollarPrice.actual.toLocaleString("es-AR", {style: "currency", currency: "ARS"})}
                  ).
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            Simular salarios actualizados
            <Checkbox
              defaultChecked={filters.simulate}
              id="simulate"
              onCheckedChange={(checked) => handleFilter("simulate", String(checked))}
            />
          </Label>
        )}
      </nav>
      <Table className="border">
        <TableCaption>Siempre tomá los valores como referencia y no como un absoluto.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead
              className={cn({underline: filters.sort === "title"}, "cursor-pointer")}
              onClick={() => handleSort("title")}
            >
              Posición
            </TableHead>
            <TableHead
              className={cn({underline: filters.sort === "currency"}, "cursor-pointer")}
              onClick={() => handleSort("currency")}
            >
              Moneda
            </TableHead>
            <TableHead
              className={cn({underline: filters.sort === "seniority"}, "cursor-pointer")}
              onClick={() => handleSort("seniority")}
            >
              Seniority
            </TableHead>
            <TableHead
              className={cn({underline: filters.sort === "value"}, "cursor-pointer")}
              onClick={() => handleSort("value")}
            >
              Salario
            </TableHead>
            <TableHead
              className={cn(
                {underline: filters.sort === "count"},
                "w-[110px] cursor-pointer text-right",
              )}
              onClick={() => handleSort("count")}
            >
              Reportes
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="scroll-y-auto max-h-[80vh]">
          {salaries.map(({count, currency, seniority, title, value}) => (
            <TableRow key={`${title}-${currency}-${seniority}`}>
              <TableCell className="font-medium">{title}</TableCell>
              <TableCell>{currency}</TableCell>
              <TableCell>{seniority}</TableCell>
              <TableCell>
                {value.toLocaleString("es-AR", {
                  style: "currency",
                  currency,
                  maximumFractionDigits: 0,
                })}
              </TableCell>
              <TableCell className="w-[110px] text-right">{count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
